import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),

  routes: [{
    component: () => import(/* webpackChunkName: "home-page" */ '@pages/Home.vue'),
    name: 'Home',
    path: '/'
  }, {
    redirect: { name: 'Home' },
    path: '/:catchAll(.*)'
  }],

  scrollBehavior: () => ({
    x: 0, y: 0
  })
})
