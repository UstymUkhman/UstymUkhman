'use strict'

const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.webSafeFileName = function (prepend, resourcePath, append) {
  let ext = path.extname(resourcePath)
  let name = path.basename(resourcePath)

  name = name.replace(new RegExp(ext, 'g'), '')
  name = name.replace(new RegExp(' ', 'g'), '-')

  return exports.assetsPath(prepend + name.toLowerCase() + append)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders =  options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

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
    scss: generateLoaders('sass', { includePaths: [path.resolve(__dirname, '../src')] }),
    sass: generateLoaders('sass', { indentedSyntax: true, includePaths: [path.resolve(__dirname, '../src')] })
  }
}

exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]

    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      subtitle: filename || '',
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
