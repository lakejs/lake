import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
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
    commonjs(),
		typescript()
	]
}
