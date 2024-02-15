import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-import-css';

export default [{
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
    image({
      dom: true,
    }),
    css(),
  ],
}, {
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
    image({
      dom: true,
    }),
    css(),
  ],
}];
