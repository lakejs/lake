import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'lib',
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    rules: {
      'no-cond-assign': ['error', 'except-parens'],
      'style/semi': ['error', 'always'],
      'style/brace-style': ['error', '1tbs'],
      'style/quote-props': ['error', 'as-needed'],
      'style/arrow-parens': ['error', 'as-needed', {
        requireForBlockBody: false,
      }],
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
        overrides: {
          interface: {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
          },
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      }],
      'style/padded-blocks': 'off',
      'antfu/consistent-list-newline': 'off',
      'ts/explicit-function-return-type': 'off',
      'ts/consistent-type-imports': 'off',
      'import/consistent-type-specifier-style': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
      'regexp/no-misleading-capturing-group': 'off',
      'regexp/no-unused-capturing-group': 'off',
      // 'jsonc/sort-keys': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'unicorn/prefer-includes': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-named-exports': 'off',
    },
    ignores: [
      'assets/**',
      'dist/**',
      'lib/**',
      'node_modules/**',
      'temp/**',
    ],
  },
);
