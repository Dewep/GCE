module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  plugins: [
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'semi': 'error',
    'no-console': 'warn'
  }
}