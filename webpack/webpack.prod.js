'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const config = require('../config')
const utils = require('../config/utils')
const baseConfig = require('./webpack.base.conf')
const prerenderPaths = require('../config/prerender')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const Renderer = PrerenderSpaPlugin.PuppeteerRenderer

const webpackConfig = merge(baseConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,

  module: {
    rules: [...utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    }), {
      use: 'webpack-modernizr-loader',
      test: /\.modernizrrc.js$/
    }]
  },

  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },

  optimization: {
    namedChunks: true,
    runtimeChunk: true,
    namedModules: true,
    removeEmptyChunks: true,
    flagIncludedChunks: true,
    mergeDuplicateChunks: true,

    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),

    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },

      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),

    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash].css')
    }),

    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),

    new HtmlWebpackPlugin({
      filename: config.build.index,
      chunksSortMode: 'dependency',
      template: 'index.html',
      inject: true,

      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },

      build: {
        deploy: config.build.deploy,
        domain: config.build.domain,
        version: config.build.version
      }
    }),

    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new PrerenderSpaPlugin({
      routes: prerenderPaths,
      indexPath: config.build.index,
      staticDir: config.build.assetsRoot,

      postProcess (renderedRoute) {
        renderedRoute.html = renderedRoute.html.replace(
          /http:\/\/localhost:[0-9]*\//ig, '/'
        )

        return renderedRoute
      },

      renderer: new Renderer({
        renderAfterDocumentEvent: 'custom-post-render-event',
        injectProperty: '__PRERENDER_INJECTED',
        maxConcurrentRoutes: 20,
        headless: true,

        inject: {
          prerenderer: true
        }
      })
    }),

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',

      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),

      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.analyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
