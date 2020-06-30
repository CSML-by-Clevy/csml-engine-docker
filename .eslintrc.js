module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'prefer-template': 'error',
    camelcase: 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'padded-blocks': ['error', { classes: 'always' }],
    'object-curly-newline': 0,
    'brace-style': 0,
  },
};
