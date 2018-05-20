module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true,
  },

  extends: [
    'plugin:vue/essential',
    'standard'
  ],

  plugins: [
    'vue'
  ],

  rules: {
    'eol-last': 0,
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
