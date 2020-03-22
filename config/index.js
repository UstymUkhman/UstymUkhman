'use strict'

const path = require('path')
const _package = require('../package.json')
const { analyze, gzip } = require('minimist')(process.argv.slice(2))

module.exports = {
  dev: {
    port: 8080,
    poll: false,
    proxyTable: {},
    useEslint: true,

    host: 'localhost',
    errorOverlay: true,
    cacheBusting: true,
    cssSourceMap: true,

    assetsPublicPath: '/',
    notifyOnErrors: false,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    showEslintErrorsInOverlay: true,
    devtool: 'cheap-module-eval-source-map'
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    domain: _package.domain || 'http://localhost:8080',
    assetsRoot: path.resolve(__dirname, '../dist'),

    gzipExtensions: ['js', 'css'],
    assetsSubDirectory: 'static',
    version: _package.version,
    devtool: '#source-map',
    assetsPublicPath: '/',

    htmlComments: false,
    analyze: analyze,
    sourceMap: true,
    comments: false,
    gzip: gzip,

    compressOptions: {
      drop_debugger: true,
      keep_infinity: true,
      drop_console: true,
      warnings: false
    }
  }
}
