const experiments = require('../src/assets/data/experiments.json')

const routes = [
  '/',
  // '/about',
  // '/works',
  // '/contacts',
  // '/more',
  // '/hole',
  // '/experiments'
  '/404'
]

experiments.forEach(experiment => {
  routes.push(`/experiments/${experiment.route}`)
})

module.exports = routes
