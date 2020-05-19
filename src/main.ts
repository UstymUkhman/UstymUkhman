import 'intersection-observer'
// import '@/utils/ServiceWorker'

import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
// eslint-disable-next-line no-unused-vars
import { AppProps } from '@/utils'

const root = document.getElementById('root') ||
             document.createElement('div')

const app: AppProps = {
  deploy: root.dataset.deploy === 'true',
  version: root.dataset.version,
  domain: root.dataset.domain,
  app: root
}

createApp(App, {
  domain: app.domain,
  version: app.version,
  deploy: app.deploy
})
  .use(router)
  .mount('#root')
