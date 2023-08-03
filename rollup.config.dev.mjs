import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
	input: './src/main.ts',
  output: {
		file: './dist/bundle.js',
		format: 'cjs'
	},
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
	plugins: [
    nodeResolve(),
		typescript(),
    commonjs(),
    json(),
	]
}, {
	input: './test/index.ts',
  output: {
		file: './dist/test/bundle.js',
		format: 'umd'
	},
  watch: {
    include: [
      'src/**',
      'test/**'
    ],
    exclude: 'node_modules/**'
  },
	plugins: [
    // nodeResolve(),
		typescript(),
    commonjs(),
    json(),
	]
}];
