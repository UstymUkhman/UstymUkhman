'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const config = require('../build/config')
const utils = require('../build/utils.js')

const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const ThreeMinifierPlugin = require('@yushijinhun/three-minifier-webpack')
/* eslint-enable @typescript-eslint/no-var-requires */

const isProduction = process.env.NODE_ENV === 'production'
const threeMinifierPlugin = new ThreeMinifierPlugin()

const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  entry: { app: 'src/main.ts' },
  context: path.resolve(__dirname, '../'),

  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        cacheBusting: config.dev.cacheBusting,
        cssSourceMap: sourceMapEnabled,

        loaders: utils.cssLoaders({
          sourceMap: sourceMapEnabled,
          extract: isProduction
        }),

        transformToRequire: {
          video: ['src', 'poster'],
          image: 'xlink:href',
          source: 'src',
          img: 'src'
        }
      }
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      }
    }, {
      test: /\.(png|jpe?g|gif)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        name: utils.assetsPath('images/[name].[hash:7].[ext]'),
        limit: 10000
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        name: utils.assetsPath('audios/[name].[hash:7].[ext]'),
        limit: 10000
      }
    }, {
      test: /\.(eot|woff2?|otf|ttf|svg)(\?.*)?$/,
      exclude: /assets(\\|\/)images/,
      loader: 'url-loader',
      options: {
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        limit: 10000
      }
    }, {
      test: /\.(vs|fs|vert|frag|glsl)$/,
      loader: 'threejs-glsl-loader'
    }, {
      test: /\.svg$/,
      loader: 'raw-loader',
      exclude: /assets(\\|\/)fonts/
    }, {
      test: /\.(gltf)$/,
      loader: 'gltf-loader-2'
    }, {
      test: /\.(bin|glb)$/,
      loader: 'file-loader'
    }]
  },

  plugins: [
    threeMinifierPlugin,
    new VueLoaderPlugin(),

    new ESLintPlugin({
      emitWarning: !config.dev.showEslintErrorsInOverlay,
      formatter: require('eslint-friendly-formatter')
    })
  ],

  resolve: {
    plugins: [threeMinifierPlugin.resolver],
    extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx', '.json'],

    alias: {
      '@components': utils.resolve('src/components'),
      modernizr$: utils.resolve('modernizr'),
      '@pages': utils.resolve('src/pages'),
      '@scss': utils.resolve('src/scss'),
      '@': utils.resolve('src'),
      vue: '@vue/runtime-dom'
    }
  },

  output: {
    filename: '[name].js',
    path: config.build.assetsRoot,

    publicPath: !isProduction
      ? config.dev.assetsPublicPath
      : config.build.assetsPublicPath
  },

  node: {
    child_process: 'empty',
    setImmediate: false,
    dgram: 'empty',
    net: 'empty',
    tls: 'empty',
    fs: 'empty'
  }
}
