'use strict'

const path = require('path')
const _package = require('../package.json')

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
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    productionGzip: false,
    devtool: '#source-map',
    productionSourceMap: true,
    productionGzipExtensions: ['js', 'css'],

    domain: _package.domain || 'http://localhost:8080',
    analyzerReport: process.env.npm_config_report,
    deploy: !!process.env.npm_config_deploy,
    version: _package.version
  }
}
