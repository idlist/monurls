module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "react"
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'semi': ['warn', 'never'],
    'quotes': ['warn', 'single'],
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
  }
};
