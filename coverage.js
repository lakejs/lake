(async () => {
  // const fs = require('fs');
  const pti = require('puppeteer-to-istanbul');
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);
  // Navigate to page
  await page.goto('http://localhost:8080/tests/');
  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);
  // const coverage = await page.evaluate('window.__coverage__');
  // console.log(coverage);
  // fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(coverage));
  pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' });
  await browser.close();
})();
