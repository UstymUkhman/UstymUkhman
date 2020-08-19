import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'

const root = document.getElementById('root')!

interface AppProps {
  readonly app: HTMLElement
  readonly version: string
  readonly deploy: boolean
  readonly domain: string
}

const app: AppProps = {
  deploy: root.dataset.deploy === 'true',
  version: root.dataset.version!,
  domain: root.dataset.domain!,
  app: root
}

createApp(App, {
  domain: app.domain,
  version: app.version,
  deploy: app.deploy
}).use(router).mount('#root')
