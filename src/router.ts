import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),

  routes: [{
    component: () => import(/* webpackChunkName: "home-page" */ '@pages/Home.vue'),
    name: 'Home',
    path: '/'
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
