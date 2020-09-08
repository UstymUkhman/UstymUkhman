import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import experiments from '@/assets/data/experiments.json'

type RedirectRoute = (route?: { name: string }) => void
type VueComponent = Promise<typeof import('*.vue')>

interface ExperimentProps {
  readonly description: string
  readonly github: string
  readonly route: string

  readonly image: string
  readonly video: string

  readonly title: string
  readonly page: string
}

const checkHomeRedirect = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: RedirectRoute): void => {
  const forbiddenDestination = to.name === 'More' || to.name === 'RabbitHole'

  if (!from.name && forbiddenDestination) {
    return next({ name: 'Home' })
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
    component: (): VueComponent => import(/* webpackChunkName: "hole-page" */ '@pages/RabbitHole.vue'),
    // beforeEnter: checkHomeRedirect,
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
    ...((experiments as Array<unknown>) as Array<ExperimentProps>).map(experiment => {
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
    redirect: { name: '404' },
    path: '/:catchAll(.*)'
  }],

  scrollBehavior: () => ({
    top: 0, left: 0
  })
})
