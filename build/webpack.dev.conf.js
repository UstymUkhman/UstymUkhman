'use strict'

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const portfinder = require('portfinder')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: config.dev.devtool,

  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
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
      poll: config.dev.poll,
    },

    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,

    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }],
    }
  },

  plugins: [
    gitRevisionPlugin,

    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: 'index.html',

      gitRevision: {
        deployFlag: config.build.deployFlag,
        targetDomain: config.build.targetDomain,
        version: JSON.stringify(gitRevisionPlugin.version()),
        commitHash: JSON.stringify(gitRevisionPlugin.commithash())
      }
    }),

    new StylelintPlugin({
      syntax: 'scss',
      files: ['**/*.vue', '**/*.scss']
    }),

    new ModernizrWebpackPlugin(require('../config/feature-detects.js')),

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
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },

        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
