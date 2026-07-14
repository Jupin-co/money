import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run() {
  const imagesDir = path.join(__dirname, '../public/images');
  const seedFile = path.join(__dirname, 'seed.sql');

  console.log('Scanning images directory to generate SQL...');

  const sqlStatements = [
    'DROP TABLE IF EXISTS items;',
    'CREATE TABLE IF NOT EXISTS items (',
    '  id TEXT PRIMARY KEY,',
    '  type TEXT NOT NULL,',
    '  country TEXT NOT NULL,',
    '  value TEXT NOT NULL,',
    '  year TEXT NOT NULL,',
    '  quality TEXT NOT NULL,',
    '  serialNumber TEXT,',
    '  title TEXT NOT NULL,',
    '  description TEXT NOT NULL,',
    '  thumbnailUrl TEXT NOT NULL,',
    '  lowResUrl TEXT NOT NULL,',
    '  highResUrl TEXT NOT NULL',
    ');',
    '',
  ];

  const r2BaseUrl = 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev';

  const countryMap = {
    ir: 'ایران',
    af: 'افغانستان',
    ae: 'امارات',
    ch: 'سوئیس',
    de: 'آلمان',
    fr: 'فرانسه',
    iq: 'عراق',
    it: 'ایتالیا',
    ng: 'نیجریه',
    pk: 'پاکستان',
    ru: 'روسیه',
    sa: 'عربستان',
    th: 'تایلند',
    uk: 'انگلستان',
    yu: 'یوگسلاوی'
  };

  const files = fs.readdirSync(imagesDir);

  // Process only the _hr.png files as the primary source of truth for items
  for (const file of files) {
    if (!file.endsWith('_hr.png')) continue;
    if (file === 'coin-back_hr.png' || file === 'coin-front_hr.png') continue;

    // e.g. af_4559588_2_vf_hr.png -> af_4559588_2_vf
    const id = file.replace('_hr.png', '');
    
    // Split by underscore: [country, serial, value, quality]
    const parts = id.split('_');
    if (parts.length < 4) {
      console.warn('Skipping file with unexpected format:', file);
      continue;
    }

    const countryCode = parts[0];
    const serial = parts[1];
    const valueRaw = parts[2];
    const quality = parts[3];

    // Create R2 URLs for the 3 resolutions
    const hrUrl = `${r2BaseUrl}/${id}_hr.png`;
    const lrUrl = `${r2BaseUrl}/${id}_lr.png`;
    const thumbUrl = `${r2BaseUrl}/${id}_thumb.png`;
    
    // Default / Map fields
    const type = 'paper_money';
    const year = 'Unknown';
    const country = countryMap[countryCode] || countryCode.toUpperCase();
    
    // Fix up value display (e.g. 500-lire -> 500 lire)
    const value = valueRaw.replace('-', ' ');
    
    const title = `${country} - ${value}`;
    const description = `Quality: ${quality.toUpperCase()} | Serial: ${serial}`;
    
    // Escape strings for SQL
    const esc = (str) => str === null || str === undefined || str === '' ? 'NULL' : `'${str.replace(/'/g, "''")}'`;

    sqlStatements.push(`INSERT INTO items (id, type, country, value, year, quality, serialNumber, title, description, thumbnailUrl, lowResUrl, highResUrl) VALUES (${esc(id)}, ${esc(type)}, ${esc(country)}, ${esc(value)}, ${esc(year)}, ${esc(quality.toUpperCase())}, ${esc(serial)}, ${esc(title)}, ${esc(description)}, ${esc(thumbUrl)}, ${esc(lrUrl)}, ${esc(hrUrl)});`);
  }

  fs.writeFileSync(seedFile, sqlStatements.join('\n'));
  console.log(`Generated seed.sql with ${sqlStatements.length - 16} INSERT statements.`);

  console.log('Skipping automated R2 upload (please upload via Cloudflare Dashboard).');
  console.log('Skipping automated D1 execute.');
  console.log('\n--> Please run: npx wrangler d1 execute gallery-db --remote --file=scripts/seed.sql');

  console.log('Bulk import script complete!');
}

run();
