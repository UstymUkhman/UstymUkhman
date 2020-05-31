declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.json' {
  const value: JSON | Array<unknown>
  export default value
}

declare module '*.svg'
declare module '*.scss'
declare module 'object-fit-images'
