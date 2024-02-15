import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-import-css';

export default [{
  input: './examples/index.ts',
  output: {
    file: './dist/examples/bundle.js',
    format: 'iife',
    sourcemap: true,
    assetFileNames: 'bundle.css',
  },
  watch: {
    include: [
      'src/**',
      'examples/**',
    ],
  },
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
  input: './tests/index.ts',
  output: {
    file: './dist/tests/bundle.js',
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
      'tests/**',
    ],
  },
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
}];
