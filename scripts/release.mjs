/**
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

/* eslint-disable no-console */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import c from 'picocolors';
import prompts from 'prompts';
import { execa } from 'execa';
import semver from 'semver';

const { version: currentVersion } = createRequire(import.meta.url)(
  '../package.json',
);
const { inc: _inc, valid } = semver;

const versionIncrements = ['patch', 'minor', 'major'];

const tags = ['latest', 'next'];

const dir = fileURLToPath(new URL('.', import.meta.url));
const inc = (i) => _inc(currentVersion, i);
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
const step = (msg) => console.log(c.cyan(msg));

function updatePackage(version) {
  const pkgPath = resolve(resolve(dir, '..'), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  pkg.version = version;

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)  }\n`);
}

async function main() {
  let targetVersion;

  const versions = versionIncrements
    .map((i) => `${i} (${inc(i)})`)
    .concat(['custom']);

  const { release } = await prompts({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versions,
  });

  if (release === 3) {
    targetVersion = (
      await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version;
  } else {
    targetVersion = versions[release].match(/\((.*)\)/)[1];
  }

  if (!valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`);
  }

  const { tag } = await prompts({
    type: 'select',
    name: 'tag',
    message: 'Select tag type',
    choices: tags,
  });

  const { yes: tagOk } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing version ${targetVersion} on ${tags[tag]}. Confirm?`,
  });

  if (!tagOk) {
    return;
  }

  // Update the package version.
  step('\nUpdating the package version...');
  updatePackage(targetVersion);

  // Build the package.
  step('\nBuilding the package...');
  await run('pnpm', ['build']);

  // Generate the changelog.
  /*
  step('\nGenerating the changelog...');
  await run('pnpm', ['changelog']);
  await run('pnpm', ['prettier', '--write', 'CHANGELOG.md']);

  const { yes: changelogOk } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: 'Changelog generated. Does it look good?',
  });

  if (!changelogOk) {
    return;
  }
  */

  // Commit changes to the Git and create a tag.
  step('\nCommitting changes...');
  // await run('git', ['add', 'CHANGELOG.md', 'package.json']);
  await run('git', ['add', 'package.json']);
  await run('git', ['commit', '-m', `release: version ${targetVersion}`]);
  await run('git', ['tag', `${targetVersion}`]);

  // Publish the package.
  step('\nPublishing the package...');
  await run('pnpm', [
    'publish',
    '--tag',
    tags[tag],
    '--ignore-scripts',
    '--no-git-checks',
  ]);

  // Push to GitHub.
  step('\nPushing to GitHub...');
  await run('git', ['push', 'origin', `refs/tags/${targetVersion}`]);
  await run('git', ['push']);
}

main().catch((err) => console.error(err));
