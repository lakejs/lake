import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';

function getWatchConfig(type: 'examples' | 'tests') {
  return {
    input: `./${type}/index.ts`,
    output: {
      file: `./dist/${type}/bundle.js`,
      format: 'iife',
      sourcemap: true,
      globals: {
        chai: 'chai',
      },
      assetFileNames: 'bundle.css',
    },
    external: [
      'chai',
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
      svg(),
      css(),
    ],
  };
}

function getBuildConfig(type: 'iife' | 'es') {
  if (type === 'iife') {
    return {
      input: './src/index.ts',
      output: [{
        file: './dist/lake.js',
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        assetFileNames: 'lake.css',
      }, {
        file: './dist/lake.min.js',
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        plugins: [terser()],
        assetFileNames: 'lake.css',
      }],
      plugins: [
        nodeResolve(),
        typescript(),
        commonjs(),
        json(),
        svg(),
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
      svg(),
      css(),
    ],
  };
}

export default (commandLineArgs: { watch: boolean }) => {
  if (commandLineArgs.watch === true) {
    return [getWatchConfig('examples'), getWatchConfig('tests')];
  }
  return [getBuildConfig('iife'), getBuildConfig('es')];
};
