import Platform from '@/platform'

const checkWebGLCompatibility = (to, from, next) => {
  if (Platform.isIE || Platform.mobile) {
    next({name: 'SiteMenu'})
    return
  }

  next()
}

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home-page" */ './pages/Home'),
    children: [
      {
        path: '',
        name: 'SiteMenu',
        component: () => import(/* webpackChunkName: "menu" */ './organisms/SiteMenu')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about-page" */ './pages/About')
      },
      {
        path: 'works',
        name: 'Works',
        component: () => import(/* webpackChunkName: "works-page" */ './pages/Works')
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: () => import(/* webpackChunkName: "contacts-page" */ './pages/Contacts')
      },
      {
        path: 'more',
        name: 'Pills',
        beforeEnter: checkWebGLCompatibility,
        component: () => import(/* webpackChunkName: "pills-page" */ './pages/Pills')
      },
      {
        path: 'hole',
        name: 'RabbitHole',
        beforeEnter: checkWebGLCompatibility,
        component: () => import(/* webpackChunkName: "rabbit-hole-page" */ './pages/RabbitHole')
      },
      {
        path: '/experiments',
        beforeEnter: checkWebGLCompatibility,
        component: () => import(/* webpackChunkName: "experiments-page" */ './pages/Experiments'),
        children: [
          {
            path: '',
            name: 'Experiments',
            component: () => import(/* webpackChunkName: "experiments" */ './organisms/Experiments')
          },
          {
            name: 'DynamicCss',
            path: 'DynamicCss',
            component: () => import(/* webpackChunkName: "dynamic-css" */ './pages/experiments/DynamicCss')
          },
          {
            name: 'ImageDrawerJs',
            path: 'ImageDrawerJs',
            component: () => import(/* webpackChunkName: "image-drawer" */ './pages/experiments/ImageDrawer')
          },
          {
            path: 'SoundParticles',
            name: 'SoundParticles',
            component: () => import(/* webpackChunkName: "sound-particles" */ './pages/experiments/SoundParticles')
          },
          {
            path: 'VideoGlitch',
            name: 'VideoGlitch',
            component: () => import(/* webpackChunkName: "video-glitch" */ './pages/experiments/VideoGlitch')
          },
          {
            path: 'FBOParticles',
            name: 'FBOParticles',
            component: () => import(/* webpackChunkName: "fbo-particles" */ './pages/experiments/FBOParticles')
          },
          {
            path: 'ColorGrading',
            name: 'ColorGrading',
            component: () => import(/* webpackChunkName: "color-grading" */ './pages/experiments/ColorGrading')
          },
          {
            path: 'VideoTransition',
            name: 'VideoTransition',
            component: () => import(/* webpackChunkName: "video-transition" */ './pages/experiments/VideoTransition')
          },
          {
            path: 'FaceTracking',
            name: 'FaceTracking',
            component: () => import(/* webpackChunkName: "face-tracking" */ './pages/experiments/FaceTracking')
          },
          {
            path: '*',
            redirect: to => { return '/experiments' }
          }
        ]
      }
    ]
  },
  {
    path: '/*',
    redirect: to => { return '/' }
  },
  {
    path: '*',
    redirect: to => { return `/${to.path}` }
  }
]

export default routes
