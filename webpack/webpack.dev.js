require('modernizr')

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const utils = require('../build/utils')
const portfinder = require('portfinder')

const config = require('../build/config')
const { merge } = require('webpack-merge')
const jsonConfig = require('../package.json')
const baseConfig = require('./webpack.base.conf')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
/* eslint-enable @typescript-eslint/no-var-requires */

const PORT = process.env.PORT && Number(process.env.PORT)
const HOST = process.env.HOST

const devWebpackConfig = merge(baseConfig, {
  mode: 'development',
  devtool: config.dev.devtool,

  module: {
    rules: [...utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    }), {
      use: 'webpack-modernizr-loader',
      test: /modernizr$/
    }]
  },

  devServer: {
    hot: true,
    quiet: true,
    compress: true,
    contentBase: false,
    historyApiFallback: true,
    clientLogLevel: 'warning',

    proxy: config.dev.proxyTable,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: config.dev.assetsPublicPath,
    watchOptions: { poll: config.dev.poll },

    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' },
      __VUE_PROD_DEVTOOLS__: config.build.prodDevtools,
      __VUE_OPTIONS_API__: config.dev.optionsAPI
    }),

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: true,

      build: {
        version: config.build.version,
        domain: config.build.domain,
        deploy: false
      }
    }),

    new StylelintPlugin({
      files: ['**/*.vue', '**/*.scss']
    }),

    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../public'),
        to: config.dev.assetsSubDirectory,
        globOptions: { ignore: ['.*'] }
      }]
    })
  ],

  optimization: {
    noEmitOnErrors: true,
    namedModules: true
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = PORT || config.dev.port

  portfinder.getPort((err, port) => {
    if (err) reject(err)

    else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port

      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },

        onErrors: !config.dev.notifyOnErrors ? undefined : (() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const notifier = require('node-notifier')

          return (severity, errors) => {
            if (severity !== 'error') return
            const filename = errors[0].file && errors[0].file.split('!').pop()

            notifier.notify({
              icon: path.join(__dirname, '../public/favicon/android-icon-36x36.png'),
              message: severity + ': ' + errors[0].name,
              subtitle: filename || '',
              title: jsonConfig.name
            })
          }
        })()
      }))

      resolve(devWebpackConfig)
    }
  })
})
