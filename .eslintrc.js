module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', 'react', '@typescript-eslint', 'react-hooks'],
  env: {
    jest: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
  },
  globals: {
    window: 'readonly',
  },
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/state-in-constructor': ['error', 'never'],
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'react/no-danger': 'error',
    'react/static-property-placement': 'off',
    'react/require-default-props': 'off',
    'react/display-name': 'off',
    'react/destructuring-assignment': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-variables',
          'static-methods',
          'instance-variables',
          'getters',
          'setters',
          'lifecycle',
          'render',
          'instance-methods',
          'everything-else',
        ],
      },
    ],
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useSubscribable|useCommunication)',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/named': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: { arrow: { before: true, after: true } },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['UPPER_CASE'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: ['@material-ui/core', '@material-ui/icons', '@material-ui/lab', 'rxjs/fetch'],
        patterns: [
          {
            group: ['@material-ui/lab/Skeleton', '@material-ui/lab/Skeleton/*'],
            message: 'Please import Skeleton from components',
          },
        ],
      },
    ],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'lines-between-class-members': 'off',
    'no-undef': 'off',
    'consistent-return': 'off',
    'default-case': 'off',
  },
};
