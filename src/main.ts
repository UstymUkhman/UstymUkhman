import { router } from '@/router'
import { createApp } from 'vue'
import App from '@/App.vue'

const root = document.getElementById('root') || document.createElement('div')
const productionBuild = root.dataset.deploy === 'true'

interface AppInfo {
  readonly version: string | undefined;
  readonly deploy: Boolean | undefined;
  readonly domain: string | undefined;
  readonly app: HTMLElement;
}

const app: AppInfo = {
  version: root.dataset.version,
  domain: root.dataset.domain,
  deploy: productionBuild,
  app: root
}

createApp(App, {
  domain: app.domain,
  version: app.version,
  deploy: app.deploy
})
  .use(router)
  .mount('#root')
