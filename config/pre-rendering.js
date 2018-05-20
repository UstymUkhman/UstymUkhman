let routes = []

routes.push('/')
routes.push('/about')
routes.push('/works')
routes.push('/contacts')
routes.push('/more')
routes.push('/hole')
routes.push('/experiments')

const experiments = require('../src/assets/data/experiments.json')

for (let i = 0; i < experiments.length; i++) {
  routes.push(`/experiments/${experiments[i].route}`)
}

module.exports = routes
