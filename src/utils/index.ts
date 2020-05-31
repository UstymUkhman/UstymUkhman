import { Ref } from 'vue'
import Rain from './Rain'
import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'
import Lettering from './Lettering'
import { Viewport } from './Viewport'
import firePrerender from './Prerender'
import ScrollObserver from './ScrollObserver'

interface WindowNavigator extends Navigator {
  userLanguage?: string
}

let userLanguage = 'en'
const navigator: WindowNavigator = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

const language = mainLanguage || navigator.language || userLanguage

export type KeyboardEventListener = (event: KeyboardEvent) => void
export type TouchEventListener = (event: TouchEvent) => void
export type VueRef<Type> = Ref<{ valueOf: () => Type }>

export {
  ScrollObserver,
  firePrerender,
  Lettering,
  Platform,
  Viewport,
  language,
  Loading,
  Sounds,
  wheel,
  Rain
}
