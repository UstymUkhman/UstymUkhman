import modernizr from 'modernizr'
const MobileDetect = require('mobile-detect')
const md = new MobileDetect(window.navigator.userAgent)

const platform: any = {
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
  chrome: /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor),
  safari: /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor),
  isIE: window.navigator.userAgent.match(/MSIE 10/i) || !!/Trident.*rv:11\./i.test(window.navigator.userAgent)
}

let userLanguage: string = 'en'
const navigator: any = window.navigator
const mainLanguage: string = navigator.languages ? navigator.languages[0] : ''

if (navigator && navigator.userLanguage) {
  userLanguage = navigator.userLanguage
}

for (const key in platform) {
  modernizr.addTest(key, () => {
    return platform[key]
  })
}

export const language = mainLanguage || navigator.language || userLanguage
export default platform
