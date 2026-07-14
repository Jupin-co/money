import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Error] ${msg.text()}`);
    } else {
      console.log(`[Log] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[Page Error] ${error.message}`);
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  console.log('Dragging...');
  const card = await page.locator('div > img').first(); // Find a card image
  if (await card.count() > 0) {
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2, { steps: 20 });
      await page.mouse.up();
      console.log('Drag finished.');
    } else {
      console.log('Card bounding box not found.');
    }
  } else {
    console.log('Card not found.');
  }
  
  await page.waitForTimeout(1000);
  await browser.close();
})();
