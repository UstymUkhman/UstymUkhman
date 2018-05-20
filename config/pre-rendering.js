// define base routes
let baseRoutes = ['/', '/service', '/threejs']

// create a copy of base routes (to be augmented by languages)
let routes = baseRoutes.concat()

// multilanguage support
// DISABLE / COMMENT if you dont' use multilanguage
// loop available languages
let languages = require('../src/assets/data/availableLanguages.json')
for (let code in languages) {
  baseRoutes.forEach((baseRoute) => {
    routes.push('/' + code + baseRoute)
  })
}
// end multilanguage support

module.exports = routes
