let routes = [
  '/',
  '/about',
  '/works',
  '/contacts',
  '/more',
  '/hole',
  '/experiments',
  '/404'
]

const experiments = require('../src/assets/data/experiments.json')

for (let i = 0; i < experiments.length; i++) {
  routes.push(`/experiments/${experiments[i].route}`)
}

module.exports = routes
