type Page = { name: string; url: string; }

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.json' {
  const value: Array<Page> | JSON
  export default value
}

declare module '*.svg'
declare module '*.scss'
