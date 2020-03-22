// // https://github.com/ChrisShank/vue-next-webpack-preview

import { router } from './router'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
  .use(router)
  .mount('#app')
