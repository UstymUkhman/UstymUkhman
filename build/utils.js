/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
/* eslint-enable @typescript-eslint/no-var-requires */

exports.cssLoaders = function (options) {
  options = options || { }

  const cssLoader = {
    options: { sourceMap: options.sourceMap },
    loader: 'css-loader'
  }

  const postcssLoader = {
    options: { sourceMap: options.sourceMap },
    loader: 'postcss-loader'
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    return options.extract
      ? [MiniCssExtractPlugin.loader].concat(loaders)
      : ['vue-style-loader'].concat(loaders)
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    styl: generateLoaders('stylus'),
    stylus: generateLoaders('stylus'),

    scss: generateLoaders('sass', {
      sassOptions: {
        includePaths: [path.resolve(__dirname, '../src/scss')]
      },

      additionalData: `
        @import 'variables.scss';
        @import 'mixins.scss';
      `
    }),

    sass: generateLoaders('sass', {
      sassOptions: {
        includePaths: [path.resolve(__dirname, '../src/sass')],
        indentedSyntax: true
      }
    })
  }
}

exports.styleLoaders = function (options) {
  const loaders = exports.cssLoaders(options)

  return Array.from(Object.keys(loaders), loader => ({
    test: new RegExp(`\\.${loader}$`),
    use: loaders[loader]
  }))
}

exports.assetsPath = function (_path) {
  return path.posix.join(
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory
    , _path
  )
}

exports.resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}
