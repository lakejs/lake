import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
  input: './src/index.ts',
  output: {
    file: './dist/src/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  watch: {
    include: 'src/**',
  },
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json()
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
  },
  external: [
    'chai'
  ],
  watch: {
    include: [
      'src/**',
      'tests/**'
    ],
  },
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json()
  ],
}];
