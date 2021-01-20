import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'

import Observer from './Observer'
import Lettering from './Lettering'
import { Viewport } from './Viewport'
import firePrerender from './Prerender'

export type MouseEventListener = (event: MouseEvent) => void
export type TouchEventListener = (event: TouchEvent) => void

type WindowNavigator = Navigator & { userLanguage?: string }

let userLanguage = 'en'
const navigator: WindowNavigator = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

export function getShadowBlur (fullsize = false): number {
  const mobile = Platform.mobile || window.innerWidth < mobileWidth
  return !Platform.chromium || mobile || fullsize ? 0 : 5
}

export const language = mainLanguage || navigator.language || userLanguage
export const matrixFont = 'normal 24px Martix Code NFI'

export const mobileWidth = 992
export const phoneWidth = 768

export const Color = {
  lightGreen: '187, 255, 187',
  white: '255, 255, 255',
  green: '0, 204, 0',
  black: '0, 0, 0'
}

export interface Experiment {
  readonly description: string
  readonly newTab?: boolean

  readonly github: string
  readonly route: string

  readonly image: string
  readonly video: string

  readonly title: string
  readonly page: string
}

export {
  firePrerender,
  Lettering,
  Platform,
  Observer,
  Viewport,
  Loading,
  Sounds,
  wheel
}
