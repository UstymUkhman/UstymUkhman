'use strict'

const path = require('path')
const config = require('../config')
const utils = require('../config/utils')
const { VueLoaderPlugin } = require('vue-loader')
const ThreeMinifierPlugin = require('@yushijinhun/three-minifier-webpack')

const threeMinifierPlugin = new ThreeMinifierPlugin()

const createLintingRule = () => ({
  enforce: 'pre',
  loader: 'eslint-loader',
  test: /\.(vue|ts|tsx|js)$/,
  include: [utils.resolve('src')],

  options: {
    emitWarning: !config.dev.showEslintErrorsInOverlay,
    formatter: require('eslint-friendly-formatter')
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),

  entry: {
    app: './src/main.ts'
  },

  plugins: [
    threeMinifierPlugin,
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
    plugins: [threeMinifierPlugin.resolver],
    extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx', '.json'],

    alias: {
      '@postprocessing': utils.resolve('node_modules/three/examples/jsm/postprocessing'),
      '@controls': utils.resolve('node_modules/three/examples/jsm/controls'),
      '@shaders': utils.resolve('node_modules/three/examples/jsm/shaders'),
      '@loaders': utils.resolve('node_modules/three/examples/jsm/loaders'),
      '@utils': utils.resolve('node_modules/three/examples/jsm/utils'),
      '@three': utils.resolve('node_modules/three/src'),

      modernizr$: utils.resolve('.modernizrrc.js'),
      '@': utils.resolve('src'),
      vue: '@vue/runtime-dom'
    }
  },

  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: utils.vueOptions
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
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
            plugins: [{
              removeViewBox: false
            }]
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
        test: /\.(vs|fs|vert|frag|glsl)$/,
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
