import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/main.ts',
  output: {
		file: './dist/lake.js',
		format: 'es'
	},
	plugins: [
    // nodeResolve(),
    commonjs(),
		typescript()
	],
  // external: ['eventemitter3']
}
