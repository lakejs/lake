import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [{
	input: './src/main.ts',
  output: [{
		file: './dist/lake.js',
		format: 'iife',
	}, {
    file: './dist/lake.min.js',
    format: 'iife',
    plugins: [
      terser(),
    ],
  }],
	plugins: [
    nodeResolve(),
		typescript(),
    commonjs(),
    json(),
	],
}, {
	input: './src/main.ts',
  output: {
    file: './lib/lake.js',
    format: 'es',
  },
	plugins: [
		typescript(),
    commonjs(),
    json(),
	],
}];
