const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600 }); 
  await page.goto('file://C:/Curro/Patologias_Dermatologicas_v5_dev/index.html', {waitUntil: 'networkidle0'});
  
  const cards = await page.$$('.disease-card');
  for (const card of cards) {
    const text = await page.evaluate(el => el.textContent, card);
    if (text.includes('Seborreico') || text.includes('NUEVO')) {
      await card.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));
  
  await page.click('.btn-start-flow');
  await new Promise(r => setTimeout(r, 500));
  
  const answers = await page.$$('.option-button');
  await answers[1].click(); // "No"
  await new Promise(r => setTimeout(r, 500));
  
  // Click "Continuar al Abordaje Terapéutico" which is a .primary-button
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('.primary-button'));
     const b = btns.find(btn => btn.textContent.includes('Continuar al Abordaje'));
     if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.screenshot({path: 'screenshot_therapeutic2.png'});
  
  await browser.close();
})();
