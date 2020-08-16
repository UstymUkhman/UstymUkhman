type Page = { name: string; url: string; }

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.json' {
  const value: JSON | Array<Page>
  export default value
}

declare module '*.svg'
declare module '*.scss'
