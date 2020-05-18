import Rain from './Rain'
import wheel from './Wheel'
import Sounds from './Sounds'
import { readonly } from 'vue'
import Loading from './Loading'
import Platform from './Platform'
import * as Number from './Number'
import * as String from './String'
import Lettering from './Lettering'
import firePrerender from './Prerender'
import { JSONLoader } from './JSONLoader'
import { Viewport, Size } from './Viewport'
import ScrollObserver from './ScrollObserver'

let userLanguage: string = 'en'
const navigator: any = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

const language = mainLanguage || navigator.language || userLanguage

const PI = readonly({
  m2: Math.PI * 2,
  d2: Math.PI / 2
})

export {
  Viewport, Size,
  Number, String,
  ScrollObserver,
  firePrerender,
  JSONLoader,
  Lettering,
  Platform,
  language,
  Loading,
  Sounds,
  wheel,
  Rain,
  PI
}
