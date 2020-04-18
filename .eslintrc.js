module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    'plugin:vue/recommended'
  ],
  plugins: [
    'vue'
  ],
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  rules: {
    'arrow-parens': 0, // allow paren-less arrow functions
    'generator-star-spacing': 0, // allow async-await
    'quote-props': ['error', 'consistent'], // make quotes around object literal property names consistent
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // allow debugger during development
    'no-console': 'warn',
    'vue/name-property-casing': ['error', 'kebab-case']
  }
}