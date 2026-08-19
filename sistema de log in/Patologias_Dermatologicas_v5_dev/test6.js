const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600 }); 
  await page.goto('file://C:/Curro/Patologias_Dermatologicas_v5_dev/index.html', {waitUntil: 'networkidle0'});
  
  // Click the seborreico card
  const cards = await page.$$('.disease-card');
  for (const card of cards) {
    const text = await page.evaluate(el => el.textContent, card);
    if (text.includes('Seborreico') || text.includes('NUEVO')) {
      await card.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));
  
  // Find a gallery item and click it
  const galleryItems = await page.$$('.gallery-item');
  if (galleryItems.length > 0) {
      await galleryItems[0].click();
      await new Promise(r => setTimeout(r, 500)); // wait for modal transition
      await page.screenshot({path: 'screenshot_modal.png'});
  }
  await browser.close();
})();
