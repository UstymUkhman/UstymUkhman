'use strict'

require('modernizr')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const portfinder = require('portfinder')

const config = require('../config')
const utils = require('../config/utils')
const baseConfig = require('./webpack.base.conf')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const PORT = process.env.PORT && Number(process.env.PORT)
const HOST = process.env.HOST

const devWebpackConfig = merge(baseConfig, {
  devtool: config.dev.devtool,
  mode: 'development',

  module: {
    rules: [...utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    }), {
      use: 'webpack-modernizr-loader',
      test: /\.modernizrrc.js$/
    }]
  },

  devServer: {
    hot: true,
    quiet: true,
    compress: true,
    contentBase: false,
    clientLogLevel: 'warning',

    proxy: config.dev.proxyTable,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: config.dev.assetsPublicPath,

    watchOptions: {
      poll: config.dev.poll
    },

    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,

    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }]
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' }
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,

      build: {
        deploy: config.build.deploy,
        domain: config.build.domain,
        version: config.build.version
      }
    }),

    new StylelintPlugin({
      files: ['**/*.vue', '**/*.scss']
    }),

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port

  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port

      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },

        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
