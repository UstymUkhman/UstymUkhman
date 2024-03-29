import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import experiments from '@/assets/data/experiments.json'
import Platform from '@/utils/Platform'

type RedirectRoute = (route?: { name: string }) => void
type VueComponent = Promise<typeof import('*.vue')>

const checkHomeParams = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RedirectRoute): void => {
  if (!Platform.prerender && to.name === 'More' && to.params.homePage !== 'true') {
    return next({ name: 'Home' })
  }

  next()
}

const checkHoleLettering = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RedirectRoute): void => {
  to.params.skipLettering = from.path.includes('/experiments').toString()
  next()
}

export default createRouter({
  history: createWebHistory(),

  routes: [{
    component: (): VueComponent => import(/* webpackChunkName: "home-page" */ '@pages/Home.vue'),
    name: 'Home',
    path: '/'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "about-page" */ '@pages/About.vue'),
    path: '/about',
    name: 'About'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "works-page" */ '@pages/Works.vue'),
    path: '/works',
    name: 'Works'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "contacts-page" */ '@pages/Contacts.vue'),
    path: '/contacts',
    name: 'Contacts'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "more-page" */ '@pages/More.vue'),
    beforeEnter: checkHomeParams,
    path: '/more',
    name: 'More'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "hole-page" */ '@pages/RabbitHole.vue'),
    beforeEnter: checkHoleLettering,
    name: 'RabbitHole',
    path: '/hole'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "experiments-page" */ '@pages/Experiments.vue'),
    path: '/experiments',
    children: [{
      component: (): VueComponent => import(/* webpackChunkName: "experiment-list" */ '@components/experiment/List.vue'),
      props: { experiments },
      name: 'Experiments',
      path: ''
    },
    ...(experiments as Array<Experiment>).map(experiment => ({
      component: (): VueComponent => import(/* webpackChunkName: "experiment-page" */ '@pages/Experiment.vue'),
      name: experiment.title,
      path: experiment.route,
      props: experiment
    }))]
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "404-page" */ '@pages/404.vue'),
    path: '/404',
    name: '404'
  }, {
    redirect: { name: '404' },
    path: '/:catchAll(.*)'
  }],

  scrollBehavior: () => ({
    top: 0, left: 0
  })
})
