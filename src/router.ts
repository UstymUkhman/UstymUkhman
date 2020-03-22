import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

export const router = createRouter({
  history: createWebHistory(),

  routes: [{
    // component: () => import(/* webpackChunkName: "home-page" */ './pages/Home.vue'),
    component: Home,
    name: 'Home',
    path: '/'
  }, {
    path: '/:catchAll(.*)',
    redirect: '/'
  }],

  scrollBehavior (to: any, from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
