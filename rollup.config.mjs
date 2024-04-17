import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';

function getBundleConfig(type) {
  const globals = {
    'js-base64': 'Base64',
    eventemitter3: 'EventEmitter3',
    'lodash': 'lodash',
    'photoswipe/lightbox': 'PhotoSwipeLightbox',
    photoswipe: 'PhotoSwipe',
    tinykeys: 'tinykeys',
    'blueimp-md5': 'md5',
    'typesafe-i18n': 'typesafeI18n',
  };
  const external = [
    'js-base64',
    'eventemitter3',
    'lodash',
    'photoswipe/style.css',
    'photoswipe/lightbox',
    'photoswipe',
    'tinykeys',
    'blueimp-md5',
    'typesafe-i18n',
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
      nodeResolve(),
      typescript(),
      commonjs(),
      json(),
      svg({
        stringify: true,
      }),
      css(),
    ],
  };
}

function getBuildConfig(type) {
  if (type === 'iife') {
    return {
      input: './src/index.ts',
      output: {
        file: './dist/lake.min.js',
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        plugins: [terser()],
        assetFileNames: 'lake.css',
      },
      plugins: [
        nodeResolve(),
        typescript(),
        commonjs(),
        json(),
        svg({
          stringify: true,
        }),
        css(),
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
    plugins: [
      typescript({
        compilerOptions: {
          rootDir: './src',
          declaration: true,
          declarationDir: './types',
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

export default (commandLineArgs) => {
  if (commandLineArgs.watch === true) {
    return [
      getBundleConfig('examples'),
      getBundleConfig('tests'),
    ];
  }
  if (commandLineArgs.test === true) {
    delete commandLineArgs.test;
    return getBundleConfig('tests');
  }
  return [
    getBuildConfig('iife'),
    getBuildConfig('es'),
  ];
};
