import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';

const codeMirrorPath = path.resolve('./src/codemirror.ts');

const globalVariables = {
  photoswipe: 'PhotoSwipe',
  'photoswipe/lightbox': 'PhotoSwipeLightbox',
  [codeMirrorPath]: 'CodeMirror',
};
const externalModules = [
  'photoswipe/style.css',
  'photoswipe',
  'photoswipe/lightbox',
  codeMirrorPath,
];

function getWatchConfig(type) {
  return {
    input: `./${type}/index.ts`,
    output: {
      file: `./dist/${type}/bundle.js`,
      format: 'iife',
      sourcemap: true,
      globals: {
        ...globalVariables,
        sinon: 'sinon',
      },
      assetFileNames: 'bundle.css',
    },
    external: [
      ...externalModules,
      'sinon',
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
    ],
  };
}

function getBuildConfig(type, extractExternal) {
  let jsFileName;
  let cssFileName;
  let globals;
  let external;
  if (extractExternal) {
    jsFileName = 'lake.min.js';
    cssFileName = 'lake.css';
    globals = globalVariables;
    external = externalModules;
  } else {
    jsFileName = 'lake-all.min.js';
    cssFileName = 'lake-all.css';
    globals = {};
    external = [];
  }
  if (type === 'iife') {
    return {
      input: './src/index.ts',
      output: {
        file: `./dist/${jsFileName}`,
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        globals,
        plugins: [terser()],
        assetFileNames: cssFileName,
      },
      external,
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
    return [
      getWatchConfig('examples'),
      getWatchConfig('tests'),
    ];
  }
  return [
    getBuildConfig('iife', true),
    getBuildConfig('iife', false),
    getBuildConfig('es'),
    getCodeMirrorBuildConfig(),
  ];
};
