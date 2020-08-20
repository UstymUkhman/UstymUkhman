import { readonly } from 'vue'
import modernizr from 'modernizr'
import MobileDetect from 'mobile-detect'
const md = new MobileDetect(window.navigator.userAgent)

interface Prerender extends Window {
  __PRERENDER_INJECTED?: unknown
}

type PlatformProps = {
  [prop: string]: boolean
}

const Platform: PlatformProps = readonly({
  mobile: !!md.mobile(),
  tablet: !!md.tablet(),
  phone: !!md.phone(),

  ios: !!md.is('iOS'),
  ipad: !!md.is('iPad'),
  iphone: !!md.is('iPhone'),
  android: !!md.is('AndroidOS'),
  wphone: !!md.is('WindowsPhoneOS'),

  firefox: md.version('Gecko') > 1,
  edge: !!/Edge\/\d+/i.test(window.navigator.userAgent),
  ie11: !!/Trident.*rv:11\./i.test(window.navigator.userAgent),
  prerender: (window as Prerender).__PRERENDER_INJECTED !== undefined,

  chrome: /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor),
  safari: /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor),
  isIE: !!window.navigator.userAgent.match(/MSIE /i) || !!/Trident\//i.test(window.navigator.userAgent),
  chromium: /Chrome/.test(window.navigator.userAgent) && !/Edge\/\d+/i.test(window.navigator.userAgent)
})

for (const key in Platform) {
  modernizr.addTest(key, () => Platform[key])
}

export default Platform
