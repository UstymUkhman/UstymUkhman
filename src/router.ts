/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import experiments from '@/assets/data/experiments.json'
/* eslint-enable no-unused-vars */
import { Platform } from '@/utils'

type PromiseImport = (page: string) => void

interface PageRoute {
  readonly component: PromiseImport
  readonly name: string
  readonly path: string
}

interface ExperimentData {
  readonly description: string
  readonly github: string
  readonly route: string

  readonly image: string
  readonly video: string

  readonly name: string
  readonly page: string
}

const checkWebGLCompatibility = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function): void => {
  const notSupportedAutoplay = !from.name && to.name === 'Pills'
  const notSupportedWebGL = Platform.isIE || Platform.mobile

  if (notSupportedWebGL || notSupportedAutoplay) {
    next({ name: 'SiteMenu' })
    return
  }

  next()
}

export default createRouter({
  history: createWebHistory(),

  routes: [{
    component: () => import(/* webpackChunkName: "home-page" */ '@pages/Home.vue'),
    name: 'Home',
    path: '/'
  }, {
    component: () => import(/* webpackChunkName: "experiments-page" */ '@pages/Experiments.vue'),
    beforeEnter: checkWebGLCompatibility,
    path: '/experiments',
    children: [{
      component: () => import(/* webpackChunkName: "experiment-list" */ '@components/ExperimentList.vue'),
      name: 'Experiments',
      path: ''
    }, ...experiments.map((experiment: ExperimentData): PageRoute => {
      return {
        component: () => import(/* webpackChunkName: "experiment-page" */ '@pages/Experiment.vue'),
        path: experiment.route,
        name: experiment.name
      }
    })]
  }, {
    component: () => import(/* webpackChunkName: "404-page" */ '@pages/404.vue'),
    path: '/404',
    name: '404'
  }, {
    redirect: { name: 'Home' },
    path: '/:catchAll(.*)'
  }],

  scrollBehavior: () => ({
    x: 0, y: 0
  })
})
