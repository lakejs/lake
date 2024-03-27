import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';
import istanbul from 'rollup-plugin-istanbul';

const codeMirrorPath = path.resolve('./src/codemirror.ts');

function getWatchConfig(type) {
  return {
    input: `./${type}/index.ts`,
    output: {
      file: `./dist/${type}/bundle.js`,
      format: 'iife',
      sourcemap: true,
      globals: {
        sinon: 'sinon',
        photoswipe: 'PhotoSwipe',
        'photoswipe/lightbox': 'PhotoSwipeLightbox',
        [codeMirrorPath]: 'CodeMirror',
      },
      assetFileNames: 'bundle.css',
    },
    external: [
      'sinon',
      'photoswipe/style.css',
      'photoswipe',
      'photoswipe/lightbox',
      codeMirrorPath,
    ],
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
      type === 'tests' ? istanbul({
        include: [
          'src/**/*.ts',
        ],
      }) : undefined,
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
        globals: {
          photoswipe: 'PhotoSwipe',
          'photoswipe/lightbox': 'PhotoSwipeLightbox',
          [codeMirrorPath]: 'CodeMirror',
        },
        plugins: [terser()],
        assetFileNames: 'lake.css',
      },
      external: [
        'photoswipe/style.css',
        'photoswipe',
        'photoswipe/lightbox',
        codeMirrorPath,
      ],
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

function getCodeMirrorBuildConfig() {
  return {
    input: './src/codemirror.ts',
    output: {
      file: './dist/codemirror.min.js',
      format: 'iife',
      name: 'CodeMirror',
      sourcemap: true,
      plugins: [terser()],
    },
    plugins: [
      nodeResolve(),
      typescript(),
    ],
  };
}

export default (commandLineArgs) => {
  if (commandLineArgs.watch === true) {
    return [getWatchConfig('examples'), getWatchConfig('tests')];
  }
  return [getBuildConfig('iife'), getBuildConfig('es'), getCodeMirrorBuildConfig()];
};
