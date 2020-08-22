/* eslint-disable @typescript-eslint/no-var-requires */
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')

const shell = require('shelljs')
const semver = require('semver')
const config = require('./config')
const webpack = require('webpack')

const child = require('child_process')
const jsonConfig = require('../package.json')
const webpackConfig = require('../webpack/webpack.prod')

/* eslint-enable @typescript-eslint/no-var-requires */
const spinner = ora('Building for production...')

const versionRequirements = [{
  currentVersion: semver.clean(process.version),
  requiredVersion: jsonConfig.engines.node,
  name: 'node'
}]

if (shell.which('npm')) {
  versionRequirements.push({
    currentVersion: child.execSync('npm --version').toString().trim(),
    requiredVersion: jsonConfig.engines.npm,
    name: 'npm'
  })
}

(function () {
  const warnings = versionRequirements.map(
    requirement => semver.satisfies(requirement.currentVersion, requirement.requiredVersion) ? '' :
      `${requirement.name}: ${chalk.red(requirement.currentVersion)} should be ${chalk.green(requirement.requiredVersion)}`
  ).filter(requirement => requirement.length)

  if (!warnings.length) return

  console.log()
  console.log(chalk.yellow('To use this template, you must update the following modules:'))

  console.log()
  warnings.forEach(warning => console.log(`   ${warning}`))

  console.log()
  process.exit(1)
})()

spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err

    process.stdout.write(`${stats.toString({
      chunkModules: false,
      children: false,
      modules: false,
      chunks: false,
      colors: true
    })}\n\n`)

    if (stats.hasErrors()) {
      console.log(chalk.red('   Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('   Build completed.\n'))

    console.log(chalk.yellow(`
       Built files are meant to be served over an HTTP server.\n
       Opening index.html over file:// won't work.\n
    `))
  })
})
