let MobileDetect = require('mobile-detect')
let md = new MobileDetect(window.navigator.userAgent)

let volumeTest = document.createElement('audio')
volumeTest.volume = 0.5

let Platform = {
  mobile: !!md.mobile(),
  phone: !!md.phone(),
  tablet: !!md.tablet(),
  android: !!md.is('AndroidOS'),
  ios: !!md.is('iOS'),
  ipad: !!md.is('iPad'),
  iphone: !!md.is('iPhone'),
  wphone: !!md.is('WindowsPhoneOS'),
  edge: !!/Edge\/\d+/i.test(window.navigator.userAgent),
  firefox: md.version('Gecko') > 1,
  ie11: !!/Trident.*rv:11\./i.test(window.navigator.userAgent),
  safari: /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor),
  prerenderer: window['__PRERENDER_INJECTED'] !== undefined, // /PhantomJS/.test(window.navigator.userAgent),
  volume: volumeTest.volume === 0.5
}

// if not prerenderer
if (!Platform.prerenderer) {
  // add custom modernizr tests
  for (let key in Platform) {
    window.Modernizr.addTest(key, () => {
      return Platform[key]
    })
  }
}

export default Platform
