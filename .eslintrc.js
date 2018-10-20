module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    // 'plugin:vue/base',
    // 'plugin:vue/essential',
    // 'plugin:vue/strongly-recommended',
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
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/name-property-casing': ['error', 'kebab-case'],
    'vue/max-attributes-per-line': [2, { 'singleline': 3 }]
  }
}
