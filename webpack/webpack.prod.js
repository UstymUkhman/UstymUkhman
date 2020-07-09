/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const utils = require('../build/utils')
const config = require('../build/config')
const baseConfig = require('./webpack.base.conf')
const prerenderPaths = require('../build/prerender')

const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
/* eslint-enable @typescript-eslint/no-var-requires */

const Renderer = PrerenderSpaPlugin.PuppeteerRenderer

const webpackConfig = merge(baseConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,

  module: {
    rules: [...utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      usePostCSS: true,
      extract: true
    }), {
      use: 'webpack-modernizr-loader',
      test: /\.modernizrrc.js$/
    }]
  },

  output: {
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    path: config.build.assetsRoot
  },

  optimization: {
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    removeEmptyChunks: true,
    runtimeChunk: true,
    namedModules: true,
    namedChunks: true,
    minimize: true,

    minimizer: [
      new TerserPlugin({
        sourceMap: config.build.sourceMap,
        parallel: true,

        terserOptions: {
          toplevel: true,

          parse: {
            html5_comments: config.build.htmlComments
          },

          compress: config.build.compressOptions,

          output: {
            comments: config.build.comments
          }
        }
      })
    ],

    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all',
          enforce: true
        },

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

    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash].css')
    }),

    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),

    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: config.build.index,
      chunksSortMode: 'auto',
      inject: true,

      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },

      build: {
        version: config.build.version,
        domain: config.build.domain,
        deploy: true
      }
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new PrerenderSpaPlugin({
      staticDir: config.build.assetsRoot,
      indexPath: config.build.index,
      routes: prerenderPaths,

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

    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../public'),
        to: config.build.assetsSubDirectory,

        globOptions: {
          ignore: [
            '**/browserconfig.xml', '**/sitemap.xml',
            '**/manifest.json', '**/robots.txt',
            '**/index.html'
          ]
        }
      }]
    })
  ]
})

if (config.build.analyze) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

if (config.build.gzip) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',

      test: new RegExp(
        '\\.(' +
        config.build.gzipExtensions.join('|') +
        ')$'
      ),

      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
