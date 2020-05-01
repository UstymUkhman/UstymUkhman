declare module '*.vue' {
  // eslint-disable-next-line no-unused-vars
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}

declare module 'vue-router'
// declare module 'lodash.find'
// declare module 'vue-event-handler'
