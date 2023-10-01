import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-import-css';

export default [{
  input: './src/main.ts',
  output: [{
    file: './dist/lake-core.js',
    format: 'iife',
    name: 'LakeCore',
    sourcemap: true,
    assetFileNames: 'lake-core.css',
  }, {
    file: './dist/lake-core.min.js',
    format: 'iife',
    name: 'LakeCore',
    sourcemap: true,
    plugins: [terser()],
    assetFileNames: 'lake-core.css',
  }],
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json(),
    css(),
  ],
}, {
  input: './src/main.ts',
  output: {
    file: './lib/lake-core.js',
    format: 'es',
    sourcemap: true,
    assetFileNames: 'lake-core.css',
  },
  plugins: [
    typescript(),
    commonjs(),
    json(),
    css(),
  ],
}];
