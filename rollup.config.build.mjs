import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [{
  input: './src/index.ts',
  output: [{
    file: './dist/lake-core.js',
    format: 'iife',
    name: 'LakeCore',
    sourcemap: true,
  }, {
    file: './dist/lake-core.min.js',
    format: 'iife',
    name: 'LakeCore',
    sourcemap: true,
    plugins: [terser()],
  }],
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs(),
    json()
  ],
}, {
  input: './src/index.ts',
  output: {
    file: './lib/lake-core.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    commonjs(),
    json()
  ],
}];
