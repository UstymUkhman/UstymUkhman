import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from '@/plugins/router'
import Platform from '@/platform'

let isTesting = window.location.href.indexOf('localhost') !== -1 ||
                window.location.href.indexOf('-develop') !== -1 ||
                window.location.href.indexOf('-master') !== -1

// only if no prerenderer
if (!Platform.prerenderer && !isTesting) {
  // usage: https://github.com/MatteoGabriele/vue-analytics
  Vue.use(VueAnalytics, {
    id: 'UA-XXXXXXXX-X', // Mandatory
    autoTracking: {
      exception: true
    },
    router
  })
}
