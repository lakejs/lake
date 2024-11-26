// See more in https://pptr.dev/api/puppeteer.coverage/

/* eslint no-console: "off" */

import pc from 'picocolors';
import puppeteer from 'puppeteer';
import { execa } from 'execa';
import waitOn from 'wait-on';

const url = 'http://localhost:8081/tests/index.html?console=true';

const step = (msg) => console.log(pc.cyan(msg));

(async() => {
  // Build the bundle file
  step('Building source code');
  await execa('pnpm', ['test:rollup']);
  // Wait for starting HTTP server
  step('Starting up an HTTP server');
  const subprocess = execa('pnpm', ['test:express']);
  await waitOn({
    resources: [
      url,
    ],
  });
  // Launche a browser and run test cases
  step('Launching a browser instance');
  // Before v22, Puppeteer launched the old Headless mode by default.
  // The old headless mode is now known as chrome-headless-shell and ships as a separate binary.
  // chrome-headless-shell does not match the behavior of the regular Chrome completely
  // but it is currently more performant for automation tasks where the complete Chrome feature set is not needed.
  // If the performance is more important for your use case, switch to chrome-headless-shell as following:
  const browser = await puppeteer.launch({
    headless: 'shell',
  });
  const page = await browser.newPage();
  let failures = 0;
  page.on('console', message => {
    const msg = message.text().trim();
    if (msg.indexOf('not ok') === 0) {
      console.log(pc.red(msg));
      failures++;
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
  // Calculate used bytes
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
  // Terminate the process
  subprocess.kill();
  if (failures > 0) {
    throw new Error(`Test failed. failures: ${failures}`);
  }
  process.exit();
})();
