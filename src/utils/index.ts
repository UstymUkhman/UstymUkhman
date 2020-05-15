import Rain from './Rain'
import wheel from './Wheel'
import Sounds from './Sounds'
import Loading from './Loading'
import Platform from './Platform'
import * as Number from './Number'
import * as String from './String'
import Lettering from './Lettering'
import { Viewport, Size } from './Viewport'

let userLanguage: string = 'en'
const navigator: any = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

export const language = mainLanguage || navigator.language || userLanguage

const firePrerenderEvent = () => {
  if (Platform.prerender) {
    setTimeout(() => {
      document.dispatchEvent(new Event('custom-post-render-event'))
    }, 1000)
  }
}

export {
  firePrerenderEvent,
  Viewport, Size,
  Number, String,
  Lettering,
  Platform,
  Loading,
  Sounds,
  wheel,
  Rain
}
