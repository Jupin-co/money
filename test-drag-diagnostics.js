import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Loading page...");
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });

  // Wait for the gallery to render
  console.log("Waiting for cards...");
  await page.waitForSelector('h3', { timeout: 10000 });
  
  // Find a card that is a stack (has "نسخه" text)
  const stackIndicator = await page.locator('text=نسخه').first();
  if (!await stackIndicator.isVisible()) {
    console.log("No stack found.");
    await browser.close();
    return;
  }
  
  // Get the parent card (the motion.div)
  const card = stackIndicator.locator('..').locator('..').locator('..').locator('..');
  
  const box = await card.boundingBox();
  console.log(`Card found at ${box.x}, ${box.y}. Size: ${box.width}x${box.height}`);

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  
  console.log("Dragging...");
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 150, startY, { steps: 10 }); // swipe left 150px
  
  let transform = await card.evaluate(el => el.style.transform);
  console.log(`Transform during drag: ${transform}`);
  
  await page.mouse.up();
  console.log("Released.");

  // Check transform every 100ms for 2 seconds
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(100);
    transform = await card.evaluate(el => el.style.transform);
    console.log(`Transform +${(i+1)*100}ms: ${transform}`);
  }

  await browser.close();
})();
