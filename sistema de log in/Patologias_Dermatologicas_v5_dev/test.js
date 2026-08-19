const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('file://C:/Curro/Patologias_Dermatologicas_v5_dev/index.html');
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
