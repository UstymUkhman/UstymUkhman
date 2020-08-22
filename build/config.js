/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const jsonConfig = require('../package.json')
const { analyze, gzip } = require('minimist')(process.argv.slice(2))
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  dev: {
    port: 8080,
    poll: false,
    useLint: true,
    proxyTable: {},

    host: 'localhost',
    optionsAPI: false,
    errorOverlay: true,
    cacheBusting: true,
    cssSourceMap: true,

    assetsPublicPath: '/',
    notifyOnErrors: false,
    autoOpenBrowser: false,
    assetsSubDirectory: 'public',
    showEslintErrorsInOverlay: true,
    devtool: 'cheap-module-eval-source-map'
  },

  build: {
    domain: jsonConfig.domain || 'http://localhost:8080/',
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),

    gzipExtensions: ['js', 'css'],
    assetsSubDirectory: 'public',
    version: jsonConfig.version,
    productionSourceMap: false,
    devtool: '#source-map',
    assetsPublicPath: '/',

    compressOptions: {
      drop_debugger: true,
      keep_infinity: true,
      drop_console: true,
      warnings: false
    },

    prodDevtools: false,
    htmlComments: false,
    analyze: analyze,
    sourceMap: true,
    comments: false,
    gzip: gzip
  }
}
