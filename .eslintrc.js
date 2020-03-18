module.exports = {
  root: true,

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  extends: [
    'plugin:vue/essential',
    '@vue/typescript',
    '@vue/standard'
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
  },

  plugins: [
    'vue'
  ],

  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
    'eol-last': 0
  }
};
