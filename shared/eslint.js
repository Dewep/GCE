const frontEslint = {
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
    semi: 'error'
  }
}

const backEslint = {
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
    semi: 'error',
    'no-console': 'warn'
  }
}

module.exports = function (env = 'front') {
  if (env === 'front') {
    return frontEslint
  }

  return backEslint
}
