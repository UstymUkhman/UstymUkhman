'use strict'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')

const shell = require('shelljs')
const semver = require('semver')
const config = require('./index')
const webpack = require('webpack')

const _package = require('../package.json')
const spinner = ora('Building for production...')
const webpackConfig = require('../webpack/webpack.prod')

function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [{
  versionRequirement: _package.engines.node,
  currentVersion: semver.clean(process.version),
  name: 'node'
}]

if (shell.which('npm')) {
  versionRequirements.push({
    versionRequirement: _package.engines.npm,
    currentVersion: exec('npm --version'),
    name: 'npm'
  })
}

(function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log()
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
})()

spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err

    process.stdout.write(stats.toString({
      chunkModules: false,
      children: false,
      modules: false,
      chunks: false,
      colors: true
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))

    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
