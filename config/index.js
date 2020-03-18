'use strict'

const path = require('path')

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
    notifyOnErrors: true,

    assetsPublicPath: '/',
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

    deployFlag: !!process.env.npm_config_deploy,
    bundleAnalyzerReport: process.env.npm_config_report,
    targetDomain: process.env.npm_config_domain ? process.env.npm_config_domain : 'http://localhost:8080'
  }
}
