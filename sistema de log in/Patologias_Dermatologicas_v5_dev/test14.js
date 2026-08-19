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
  
  // Click button to start orientacion
  await page.click('.btn-start-flow');
  await new Promise(r => setTimeout(r, 500));
  
  // Click Branch B
  const answers = await page.$$('.option-button');
  await answers[1].click(); // "No"
  await new Promise(r => setTimeout(r, 500));
  
  // Click "Continuar al Abordaje Terapéutico"
  await page.click('.primary-button');
  await new Promise(r => setTimeout(r, 500));
  
  await page.screenshot({path: 'screenshot_therapeutic.png'});
  
  await browser.close();
})();
