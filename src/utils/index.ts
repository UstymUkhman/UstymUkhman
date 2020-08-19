import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'
import Lettering from './Lettering'
import { Viewport } from './Viewport'
import firePrerender from './Prerender'
import ScrollObserver from './ScrollObserver'

export type VueHTMLElement<HTMLElement> = HTMLElement & { $el: HTMLElement }
export type KeyboardEventListener = (event: KeyboardEvent) => void
export type MouseEventListener = (event: MouseEvent) => void
export type TouchEventListener = (event: TouchEvent) => void

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
const matrixFont = 'normal 24px Martix Code NFI'

const Color = {
  lightGreen: '187, 255, 187',
  white: '255, 255, 255',
  green: '0, 204, 0',
  black: '0, 0, 0'
}

const mobileWidth = 992
const phoneWidth = 768

export {
  ScrollObserver,
  firePrerender,
  mobileWidth,
  phoneWidth,
  matrixFont,
  Lettering,
  Platform,
  Viewport,
  language,
  Loading,
  Sounds,
  Color,
  wheel
}
