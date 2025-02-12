/*
MIT License

Copyright (c) 2019-present, Yuxi (Evan) You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Repository: https://github.com/vuejs/vitepress/blob/main/scripts/release.js
*/

import pico from 'picocolors';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';

const msgPath = path.resolve('.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(?:revert: )?(?:feat|fix|perf|style|refactor|test|chore|release)(?:\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.error(
    `  ${pico.white(pico.bgRed(' ERROR '))} ${pico.red(
      'Invalid commit message format:',
    )}\n\n${
      pico.red(
        '  Proper commit message format is required for automated changelog generation. Examples:\n\n',
      )
    }    ${pico.green('feat(history): add emitEvent option')}\n`
    + `    ${pico.green(
      'fix(bold): incorrect index when undoing (close #28)',
    )}\n\n${
      pico.red('  See .github/commit-convention.md for more details.\n')}`,
  );
  process.exit(1);
}
