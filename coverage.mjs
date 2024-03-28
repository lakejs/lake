// See more in https://pptr.dev/api/puppeteer.coverage/

/* eslint no-console: "off" */

import puppeteer from 'puppeteer';

const url = 'http://localhost:8080/tests/index.html';

(async() => {
  // Launches a browser and runs test cases
  console.log('Launching a browser instance');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.coverage.startJSCoverage();
  console.log(`Navigating to ${url}`);
  await page.goto(url);
  console.log('Running test cases');
  console.time('Duration');
  await page.waitForFunction('window.mocha.status === "done"');
  console.log('All tests are finished');
  console.timeEnd('Duration');
  const jsCoverage = await page.coverage.stopJSCoverage();
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
