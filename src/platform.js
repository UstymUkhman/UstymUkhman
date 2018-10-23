const MobileDetect = require('mobile-detect')
const md = new MobileDetect(window.navigator.userAgent)

const volumeTest = document.createElement('audio')
volumeTest.volume = 0.5

const Platform = {
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
  safari: /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor),
  isIE: navigator.userAgent.match(/MSIE 10/i) || !!/Trident.*rv:11\./i.test(window.navigator.userAgent),

  prerenderer: window['__PRERENDER_INJECTED'] !== undefined,
  volume: volumeTest.volume === 0.5
}

if (!Platform.prerenderer) {
  for (const key in Platform) {
    window.Modernizr.addTest(key, () => {
      return Platform[key]
    })
  }
}

export default Platform
