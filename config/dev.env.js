'use strict'

const prodEnv = require('./prod.env')
const merge = require('webpack-merge')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
