// See more in https://pptr.dev/api/puppeteer.coverage/

/* eslint no-console: "off" */

import puppeteer from 'puppeteer';

const url = 'http://localhost:8080/tests/index.html?console=true';

(async() => {
  // Launches a browser and runs test cases
  console.log('Launching a browser instance');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  page.on('console', message => {
    console.log(message.text().trim());
  });
  console.log(`Navigating to ${url}`);
  console.time('Duration');
  await page.coverage.startJSCoverage();
  await page.goto(url);
  await page.waitForFunction('window.mocha.status === "done"');
  const jsCoverage = await page.coverage.stopJSCoverage();
  console.timeEnd('Duration');
  await browser.close();

  // Calculates used bytes
  let totalBytes = 0;
  let usedBytes = 0;
  for (const entry of jsCoverage) {
    if (entry.url.indexOf('bundle.js') >=0 ) {
      totalBytes += entry.text.length;
      for (const range of entry.ranges) {
        usedBytes += range.end - range.start - 1;
      }
    }
  }
  console.log(`Bytes used: ${(usedBytes / totalBytes * 100).toFixed(2)}%`);
})();
