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
      // tseslint.configs.stylistic,
    ],
    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'class-methods-use-this': 'off',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-trailing-spaces': 'error',
      'no-plusplus': 'off',
      'no-param-reassign': 'off',
      'no-cond-assign': 'off',
      'no-continue': 'error',
      'no-restricted-syntax': 'off',
      'no-throw-literal': 'error',
      'no-use-before-define': 'error',
      'consistent-return': 'off',
      'prefer-destructuring': 'off',
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
