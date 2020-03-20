// import { router } from './router'
import platform from '@/platform'
import { createApp } from 'vue'
import App from './App.vue'

console.log(platform)

createApp(App)
  // .use(router)
  .mount('#app')
