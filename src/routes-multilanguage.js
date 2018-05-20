import Platform from '@/platform'
import availableLanguages from '@/assets/data/availableLanguages.json'
// only pages should be imported and used here
// http://bradfrost.com/blog/post/atomic-web-design/

// language management
let matchAvailableLanguage = ''
Object.keys(availableLanguages).forEach((lang) => {
  matchAvailableLanguage += lang + '|'
})
matchAvailableLanguage = matchAvailableLanguage.substring(0, matchAvailableLanguage.lastIndexOf('|'))

let userLanguage

if (!Platform.prerenderer) {
  userLanguage = (window.navigator.languages ? window.navigator.languages[0] : null) || window.navigator.userLanguage || window.navigator.language || 'en'
  // strip down '-US' part (as in 'en-US' or similar) if present
  userLanguage = userLanguage.split('-')[0]
} else {
  userLanguage = 'en'
}

let getValidLanguage = () => {
  if (availableLanguages[userLanguage]) {
    return userLanguage
  }
  return Object.keys(availableLanguages)[0]
}

let routes = [
  {
    // use '/' if you don't want multilanguage
    path: `/:language(${matchAvailableLanguage})`,
    name: 'Home',
    component: () => import(/* webpackChunkName: "page-home" */ './pages/HomePage')
  },
  {
    // use '/service' if you don't want multilanguage
    path: `/:language(${matchAvailableLanguage})/service`,
    name: 'Service',
    component: () => import(/* webpackChunkName: "page-service" */ './pages/ServicePage')
  },
  {
    // use '/service' if you don't want multilanguage
    path: `/:language(${matchAvailableLanguage})/threejs`,
    name: 'Threejs',
    component: () => import(/* webpackChunkName: "page-threejs" */ './pages/ThreejsPage')
  },
  {
    // matches /validlanguage/invalidroute and redirects it to /validlanguage
    path: `/:language(${matchAvailableLanguage})/*`,
    redirect: to => {
      return `/${getValidLanguage()}`
    }
  },
  {
    // matches /invalidlanguage/anyroute and redirects it to /validlanguage/anyroute
    path: `/:language(\\w{2,2}\\b)/*`,
    redirect: to => {
      return `/${getValidLanguage()}/${to.params[0]}`
    }
  },
  {
    // matches /anyroute and redirects it to /validlanguage/anyroute
    path: '*',
    redirect: to => {
      return `/${getValidLanguage()}${to.path}`
    }
  }
]

export default routes
