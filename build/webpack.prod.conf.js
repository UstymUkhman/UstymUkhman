'use strict'

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const env = require('../config/prod.env')

const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const prerenderPaths = require('../config/pre-rendering')
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer
const gitRevisionPlugin = new GitRevisionPlugin()

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,

  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
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
    gitRevisionPlugin,

    new ModernizrWebpackPlugin(require('../config/feature-detects.js')),

    new webpack.DefinePlugin({
      'process.env': env
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

      gitRevision: {
        deployFlag: config.build.deployFlag,
        targetDomain: config.build.targetDomain,
        version: JSON.stringify(gitRevisionPlugin.version()),
        commitHash: JSON.stringify(gitRevisionPlugin.commithash())
      }
    }),

    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new PrerenderSpaPlugin({
      routes: prerenderPaths,
      indexPath: config.build.index,
      staticDir: config.build.assetsRoot,

      postProcess (renderedRoute) {
        renderedRoute.html =  renderedRoute.html.replace(
          /http:\/\/localhost:[0-9]*\//ig,
          '/'
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

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
