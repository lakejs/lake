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
      'no-cond-assign': 'off',
      'antfu/consistent-list-newline': 'off',
      'antfu/top-level-function': 'off',
      'style/semi': ['error', 'always'],
      'style/brace-style': ['error', '1tbs'],
      'style/quote-props': ['error', 'as-needed'],
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
        },
      }],
      'style/padded-blocks': 'off',
      'style/arrow-parens': 'off',
      'jsonc/sort-keys': 'off',
      'unicorn/prefer-includes': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'ts/explicit-function-return-type': 'off',
      'ts/consistent-type-imports': 'off',
      'import/consistent-type-specifier-style': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
      'regexp/no-misleading-capturing-group': 'off',
      'regexp/no-unused-capturing-group': 'off',
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
