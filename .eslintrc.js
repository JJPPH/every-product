module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 14,
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-alert': 0,
    'no-underscore-dangle': 0,
  },
}
