const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600 }); // Taller to see images
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
  await page.screenshot({path: 'screenshot_images.png'});
  await browser.close();
})();
