'use strict'

const path = require('path')
const utils = require('./utils')
const config = require('../config')

const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: {
    app: './src/main.js'
  },

  plugins: [
    new VueLoaderPlugin()
  ],

  output: {
    filename: '[name].js',
    path: config.build.assetsRoot,

    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],

    alias: {
      '@three': 'three-full/sources',
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },

  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('node_modules/webpack-dev-server/client'),
          resolve('node_modules/element-ui/src'),
          resolve('node_modules/element-ui/packages'),
          resolve('node_modules/vue-color/src'),
          resolve('node_modules/vue-spinner/src'),
          resolve('node_modules/three-full/sources')
        ]
      },

      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        exclude: /3d(\\|\/)assets/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },

      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        options: {
          svgo: {
            plugins: [
              {removeViewBox: false}
            ]
          }
        }
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },

      {
        test: /\.(glsl|vert|frag)$/,
        loader: 'threejs-glsl-loader'
      },

      {
        test: /\.(gltf)$/,
        loader: 'gltf-loader-2'
      },

      {
        test: /3d(\\|\/)assets.*\.(bin|png|jpe?g|gif|glb|json)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: utils.assetsPath('assets-3d/[name].[hash:7].[ext]')
            }
          }
        ]
      }
    ]
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
