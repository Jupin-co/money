import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "gallery-images";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("\x1b[31mError: Missing Cloudflare credentials in your .env file.\x1b[0m");
  console.error("Please add the following variables to your .env file:");
  console.error("CLOUDFLARE_ACCOUNT_ID=your_account_id");
  console.error("R2_ACCESS_KEY_ID=your_access_key_id");
  console.error("R2_SECRET_ACCESS_KEY=your_secret_access_key");
  console.error("R2_BUCKET_NAME=gallery-images");
  process.exit(1);
}

const s3 = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: "auto",
});

const IMAGES_DIR = path.join(__dirname, "../public/images");

async function uploadFile(filePath, fileName) {
  const fileStream = fs.createReadStream(filePath);
  const fileStats = fs.statSync(filePath);

  // Guess MIME type
  let contentType = "application/octet-stream";
  if (fileName.endsWith(".png")) contentType = "image/png";
  else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) contentType = "image/jpeg";
  else if (fileName.endsWith(".webp")) contentType = "image/webp";
  else if (fileName.endsWith(".svg")) contentType = "image/svg+xml";

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentLength: fileStats.size,
      ContentType: contentType,
    });

    await s3.send(command);
    console.log(`\x1b[32mSuccessfully uploaded:\x1b[0m ${fileName}`);
  } catch (error) {
    console.error(`\x1b[31mFailed to upload ${fileName}:\x1b[0m`, error.message);
  }
}

async function main() {
  console.log(`Scanning directory: ${IMAGES_DIR}`);
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
  
  const uploadPromises = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      const filePath = path.join(IMAGES_DIR, file);
      uploadPromises.push(uploadFile(filePath, file));
    }
  }

  if (uploadPromises.length === 0) {
    console.log("No images found to upload.");
    return;
  }

  console.log(`Starting upload of ${uploadPromises.length} images to bucket "${bucketName}"...`);
  await Promise.all(uploadPromises);
  console.log("\n\x1b[32mUpload finished!\x1b[0m");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
});
