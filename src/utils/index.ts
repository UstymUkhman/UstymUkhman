import ScrollObserver from './ScrollObserver'
import { Viewport, Size } from './Viewport'
import firePrerender from './Prerender'
import Lettering from './Lettering'
import Platform from './Platform'
import Loading from './Loading'
import Sounds from './Sounds'
import wheel from './Wheel'
import Rain from './Rain'

let userLanguage: string = 'en'
const navigator: any = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

const language = mainLanguage || navigator.language || userLanguage

export type KeyboardEventListener = (event: KeyboardEvent) => void

export interface AppProps {
  readonly version: string | undefined;
  readonly deploy: Boolean | undefined;
  readonly domain: string | undefined;
  readonly app?: HTMLElement;
}

export {
  Viewport, Size,
  ScrollObserver,
  firePrerender,
  Lettering,
  Platform,
  language,
  Loading,
  Sounds,
  wheel,
  Rain
}
