import Vue from 'vue'
import VueRouter from 'vue-router'

// IMPORTANT: Use only one of the options below
// also please delete the file you don't use in the project

// use this if you don't want /en/route notation
// import routes from '../routes-singlelanguage'

// use this if you prefer /en/route notation
// and automatic user language detection
import routes from '../routes-multilanguage'

// docs: https://router.vuejs.org/en/
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
