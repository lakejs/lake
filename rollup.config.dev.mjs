import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
	input: './src/main.ts',
  output: {
		file: './dist/src/bundle.js',
		format: 'cjs',
    sourcemap: true,
	},
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
  },
	plugins: [
    nodeResolve(),
		typescript(),
    commonjs(),
    json(),
	]
}, {
	input: './test/main.ts',
  output: {
		file: './dist/test/bundle.js',
		format: 'umd',
    sourcemap: true,
    globals: {
      chai: 'chai',
    },
	},
  external: [
    'chai',
  ],
  watch: {
    include: [
      'src/**',
      'test/**',
    ],
    exclude: 'node_modules/**',
  },
	plugins: [
    nodeResolve(),
		typescript(),
    commonjs(),
    json(),
	]
}];
