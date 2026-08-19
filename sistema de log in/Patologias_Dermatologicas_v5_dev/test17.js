const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.setViewport({ width: 1280, height: 1600 }); 
  await page.goto('file://C:/Curro/Patologias_Dermatologicas_v5_dev/index.html', {waitUntil: 'networkidle0'});
  
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.disease-card');
    for (const card of cards) {
      if (card.textContent.includes('Seborreico') || card.textContent.includes('NUEVO')) {
        card.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    document.querySelector('.btn-start-flow').click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    const answers = document.querySelectorAll('.option-button');
    answers[1].click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent.includes('Continuar al Abordaje'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await browser.close();
})();
