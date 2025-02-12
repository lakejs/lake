import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';
import CleanCSS from 'clean-css';

const rootPath = path.dirname(fileURLToPath(import.meta.url));

const aliasOptions = {
  entries: [
    {
      find: 'lakelib',
      replacement: path.resolve(rootPath, 'src'),
    },
  ],
};

function getConfigForThirdParty(inputFile) {
  const outputFile = `./temp/${inputFile.replace(/\.ts$/, '.js')}`;
  if (fs.existsSync(path.resolve(rootPath, outputFile))) {
    return;
  }
  return {
    input: `./${inputFile}`,
    output: {
      file: outputFile,
      format: 'iife',
      sourcemap: true,
    },
    watch: {
      include: [
        inputFile,
      ],
    },
    plugins: [
      nodeResolve(),
      typescript({
        compilerOptions: {
          outDir: './temp',
        },
      }),
      commonjs(),
    ],
  };
}

function getBundleConfig(type) {
  const globals = {
    'photoswipe/lightbox': 'PhotoSwipeLightbox',
    photoswipe: 'PhotoSwipe',
  };
  const external = [
    'photoswipe/style.css',
    'photoswipe/lightbox',
    'photoswipe',
  ];
  if (type === 'tests') {
    globals.sinon = 'sinon';
    external.push('sinon');
  }
  return {
    input: `./${type}/index.ts`,
    output: {
      file: `./temp/${type}/bundle.js`,
      format: 'iife',
      sourcemap: true,
      globals,
      assetFileNames: 'bundle.css',
    },
    external,
    watch: {
      include: [
        'src/**',
        `${type}/**`,
      ],
    },
    plugins: [
      alias(aliasOptions),
      nodeResolve(),
      typescript({
        compilerOptions: {
          outDir: './temp',
        },
      }),
      commonjs(),
      json(),
      svg({
        stringify: true,
      }),
      css(),
    ],
  };
}

function getConfigForPublishing(type) {
  if (type === 'iife') {
    return {
      input: './src/index.ts',
      output: {
        file: './dist/lake.min.js',
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        plugins: [terser()],
        assetFileNames: 'lake.min.css',
      },
      watch: {
        include: [
          'src/**',
        ],
      },
      plugins: [
        alias(aliasOptions),
        nodeResolve(),
        typescript({
          compilerOptions: {
            outDir: './dist',
          },
        }),
        commonjs(),
        json(),
        svg({
          stringify: true,
        }),
        css({
          transform: code => new CleanCSS().minify(code).styles,
        }),
      ],
    };
  }
  return {
    input: './src/index.ts',
    output: {
      file: './lib/lake.js',
      format: 'es',
      sourcemap: true,
      assetFileNames: 'lake.css',
    },
    watch: {
      include: [
        'src/**',
      ],
    },
    plugins: [
      alias(aliasOptions),
      typescript({
        compilerOptions: {
          outDir: './lib',
        },
      }),
      commonjs(),
      json(),
      svg({
        stringify: true,
      }),
      css(),
    ],
  };
}

export default commandLineArgs => {
  const configList = [];
  if (commandLineArgs.example === true) {
    delete commandLineArgs.example;
    configList.push(getBundleConfig('examples'));
  }
  if (commandLineArgs.test === true) {
    delete commandLineArgs.test;
    configList.push(getConfigForThirdParty('tests/chai.ts'));
    configList.push(getBundleConfig('tests'));
  }
  if (commandLineArgs.iife === true) {
    delete commandLineArgs.iife;
    configList.push(getConfigForPublishing('iife'));
  }
  if (commandLineArgs.es === true) {
    delete commandLineArgs.es;
    configList.push(getConfigForPublishing('es'));
    // Generate and bundle lake.d.ts, also does type checking.
    configList.push({
      input: './src/index.ts',
      output: {
        file: './lib/lake.d.ts',
        format: 'es',
      },
      plugins: [
        alias(aliasOptions),
        dts(),
        css(),
      ],
    });
  }
  return configList.filter(config => config !== undefined);
};
