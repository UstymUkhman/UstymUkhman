module.exports = {
  root: true,
  parser: 'vue-eslint-parser',

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],

  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    'generator-star-spacing': 0,
    'no-debugger': 0,
    'no-console': 0
  },

  plugins: [
    '@typescript-eslint',
    'vue'
  ],

  globals: {
    navigator: false,
    document: false,
    unescape: false,
    describe: true,
    escape: false,
    window: false,
    before: true,
    expect: true,
    THREE: false,
    sinon: true,
    it: true
  },

  env: {
    browser: true,
    node: true
  }
}
