// See more in https://pptr.dev/api/puppeteer.coverage/

/* eslint no-console: "off" */

import pc from 'picocolors';
import puppeteer from 'puppeteer';

const url = 'http://localhost:8080/tests/index.html?console=true';

const step = (msg) => console.log(pc.cyan(msg));

(async() => {
  // Launches a browser and runs test cases
  step('Launching a browser instance');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  page.on('console', message => {
    const msg = message.text().trim();
    if (msg.indexOf('not ok') === 0) {
      console.log(pc.red(msg));
    } else {
      console.log(msg);
    }
  });
  step(`Navigating to ${url}`);
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
