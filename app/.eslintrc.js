module.exports = {
  root: false,
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard',
    'plugin:vue3/recommended'
  ],
  plugins: [
    'vue'
  ],
  parserOptions: {
    parser: 'vue-eslint-parser',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'semi': 'error'
  }
}