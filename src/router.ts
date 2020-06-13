import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import experiments from '@/assets/data/experiments.json'

type RedirectRoute = (route?: { name: string }) => void
type VueComponent = Promise<typeof import('*.vue')>
type PromiseImport = (page: string) => void

interface ExperimentProps {
  readonly description: string | undefined
  readonly github: string | undefined
  readonly route: string

  readonly image: string
  readonly video: string

  readonly title: string
  readonly page: string
}

interface PageRoute {
  readonly component: PromiseImport
  readonly props: ExperimentProps
  readonly name: string
  readonly path: string
}

const checkHomeRedirect = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RedirectRoute): void => {
  if (!from.name && to.name === 'More') {
    next({ name: 'Home' })
    return
  }

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
    beforeEnter: checkHomeRedirect,
    path: '/more',
    name: 'More'
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "experiments-page" */ '@pages/Experiments.vue'),
    beforeEnter: checkHomeRedirect,
    props: { experiments },
    path: '/experiments',
    children: [{
      component: (): VueComponent => import(/* webpackChunkName: "experiment-list" */ '@components/experiments/List.vue'),
      name: 'Experiments',
      path: ''
    },
    ...(experiments as Array<ExperimentProps>).map((experiment: ExperimentProps): PageRoute => {
      return {
        component: (): VueComponent => import(/* webpackChunkName: "experiment-page" */ '@pages/Experiment.vue'),
        name: experiment.title,
        path: experiment.route,
        props: experiment
      }
    })]
  }, {
    component: (): VueComponent => import(/* webpackChunkName: "404-page" */ '@pages/404.vue'),
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
