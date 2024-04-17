// See more in https://pptr.dev/api/puppeteer.coverage/

/* eslint no-console: "off" */

import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';
import puppeteer from 'puppeteer';
import { execa } from 'execa';
import waitOn from 'wait-on';

const url = 'http://localhost:8081/tests/index.html?console=true';

const scriptsPath = path.dirname(fileURLToPath(import.meta.url));
const bundleFile = path.resolve(scriptsPath, '../temp/tests/bundle.js');

const step = (msg) => console.log(pc.cyan(msg));

(async() => {
  // Build the bundle file if it is not exist
  if (!existsSync(bundleFile)) {
    step(`Building ${bundleFile}`);
    await execa('pnpm', ['test:rollup']);
  }
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
  const browser = await puppeteer.launch({
    headless: true,
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
