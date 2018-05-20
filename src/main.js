import 'babel-polyfill'
import 'console-polyfill'

import Vue from 'vue'
import App from './App'
import Platform from './platform'

import './plugins/analytics.js'
import router from './plugins/router.js'

import axios from 'axios'
import VueMeta from 'vue-meta'
import VueAxios from 'vue-axios'
import Preloader from './preloader'
import VueEvents from 'vue-event-handler'

import { ScrollContainer, ScrollElement } from '@/directives/ScrollNotification'

Vue.use(VueMeta)
Vue.use(VueEvents)
Vue.use(VueAxios, axios)

Vue.use(ScrollElement)
Vue.use(ScrollContainer)

const preloaderInstance = new Vue(Preloader)

router.beforeEach((to, from, next) => {
  preloaderInstance.visible = true
  next()
})

router.afterEach((to, from) => {
  preloaderInstance.visible = false
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',

  computed: {
    platform: function () {
      return Platform
    },

    targetDomain: function () {
      return this.$el.attributes['target-domain'].value
    }
  },

  render (createElement) {
    return createElement(App, {
      props: {
        preloader: preloaderInstance,
        version: this.$el.attributes.version.value,
        commitHash: this.$el.attributes['commit-hash'].value,
        targetDomain: this.$el.attributes['target-domain'].value,
        deployFlag: this.$el.attributes['deploy-flag'] ? this.$el.attributes['deploy-flag'].value === 'true' : false
      }
    })
  }
})
/* eslint-enable no-new */
