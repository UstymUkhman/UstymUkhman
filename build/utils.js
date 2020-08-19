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
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    styl: generateLoaders('stylus'),
    stylus: generateLoaders('stylus'),

    scss: generateLoaders('sass', {
      additionalData: `
        @import 'variables.scss';
        @import 'mixins.scss';
      `,

      sassOptions: {
        includePaths: [path.resolve(__dirname, '../src/scss')]
      }
    }),

    sass: generateLoaders('sass', {
      sassOptions: {
        indentedSyntax: true,
        includePaths: [path.resolve(__dirname, '../src/sass')]
      }
    })
  }
}

exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]

    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loader
    })
  }

  return output
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
