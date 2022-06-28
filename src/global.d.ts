declare type Experiment = import('@/utils').Experiment
declare type Page = { name: string; url: string; }

declare module '*.json' {
  const value: JSON | Array<Page | Experiment>
  export default value
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'

declare module '*.wav'
declare module '*.mp3'
declare module '*.mp4'

declare module '*.vert'
declare module '*.frag'
