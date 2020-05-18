import 'object-fit-images'
import 'intersection-observer'
import '@/utils/ServiceWorker'

import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'

const root = document.getElementById('root') ||
             document.createElement('div')

interface AppInfo {
  readonly version: string | undefined;
  readonly deploy: Boolean | undefined;
  readonly domain: string | undefined;
  readonly app: HTMLElement;
}

const app: AppInfo = {
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
