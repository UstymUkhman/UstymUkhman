import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'

import Observer from './Observer'
import Lettering from './Lettering'
import { Viewport } from './Viewport'
import firePrerender from './Prerender'

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

export function getShadowBlur (fullscreen = false): number {
  const mobile = Platform.mobile || window.innerWidth < mobileWidth
  return !Platform.chromium || mobile || fullscreen ? 0 : 5
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
  firePrerender,
  mobileWidth,
  phoneWidth,
  matrixFont,
  Lettering,
  Platform,
  Observer,
  Viewport,
  language,
  Loading,
  Sounds,
  Color,
  wheel
}
