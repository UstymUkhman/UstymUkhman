// import polyfills
import 'babel-polyfill'
import 'console-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Platform from './platform'

import router from './plugins/router.js'
import './plugins/analytics.js'
import './plugins/locale.js'
import VueMeta from 'vue-meta'
import VueEvents from 'vue-event-handler'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Preloader from './preloader'
// usage: https://github.com/declandewet/vue-meta
Vue.use(VueMeta)
// usage: https://github.com/sandeepk01/vue-event-handler
Vue.use(VueEvents)
// usage: https://github.com/imcvampire/vue-axios
Vue.use(VueAxios, axios)
//
//
// Initialization of the preloader app (placed on the HTML)
//
//
let preloaderInstance = new Vue(Preloader)

// management of languages
router.beforeEach((to, from, next) => {
  // set current language on change route
  preloaderInstance.visible = true
  if (to.params.language) {
    Vue.config.language = to.params.language
  }
  next()
})
router.afterEach((to, from) => {
  preloaderInstance.visible = false
})

//
//
// Initialization of the app (placed on the HTML)
//
//
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  computed: {
    platform: function () {
      return Platform
    },
    targetDomain: function () {
      return this.$el.attributes['target-domain'].value
    }
  },
  // this block allows passing props to the main App
  // these props are set by html-webpack-plugin in the html
  // and the values are taken from git-revision-webpack-plugin
  render (createElement) {
    return createElement(App, {
      props: {
        version: this.$el.attributes.version.value,
        commitHash: this.$el.attributes['commit-hash'].value,
        deployFlag: this.$el.attributes['deploy-flag'] ? this.$el.attributes['deploy-flag'].value === 'true' : false,
        targetDomain: this.$el.attributes['target-domain'].value,
        preloader: preloaderInstance
      }
    })
  }
})
