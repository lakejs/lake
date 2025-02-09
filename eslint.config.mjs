import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'assets/**',
      'dist/**',
      'lib/**',
      'node_modules/**',
      'temp/**',
    ],
  },
  {
    files: [
      '**/*.mjs',
      '**/*.ts',
    ],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-trailing-spaces': 'error',
      'no-continue': 'error',
      'no-throw-literal': 'error',
      'no-use-before-define': 'error',
      'prefer-template': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'func-names': ['error', 'never'],
      'func-call-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
  },
  {
    files: [
      'examples/**',
      'src/**',
      'tests/**',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
    },
  },
  {
    files: [
      'scripts/**',
      '*.mjs',
    ],
    rules: {
      'prefer-template': 'off',
    },
  },
);
