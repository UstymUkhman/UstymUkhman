import Rain from './Rain'
import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'
import Lettering from './Lettering'
import firePrerender from './Prerender'
import { Viewport, Size } from './Viewport'
import ScrollObserver from './ScrollObserver'

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
