const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('file://C:/Curro/Patologias_Dermatologicas_v5_dev/index.html', {waitUntil: 'networkidle0'});
  
  const cards = await page.$$('.disease-card');
  let clicked = false;
  for (const card of cards) {
    const text = await page.evaluate(el => el.textContent, card);
    if (text.includes('Seborreico') || text.includes('NUEVO')) {
      await card.click();
      clicked = true;
      break;
    }
  }
  
  console.log('Clicked:', clicked);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({path: 'screenshot2.png'});
  await browser.close();
})();
