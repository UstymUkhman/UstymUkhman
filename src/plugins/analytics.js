import Vue from 'vue'
import Platform from '@/platform'
import router from '@/plugins/router'
import VueAnalytics from 'vue-analytics'

if (!Platform.prerenderer && !window.location.href.includes('localhost')) {
  Vue.use(VueAnalytics, {
    id: 'UA-63625554-3',
    appName: 'My Website',
    autoTracking: { exception: true },
    appVersion: '2.0',
    vueRouter: router,
    debug: false
  })
}
