module.exports = {
  options: ['addTest', 'setClasses'],
  minify: true,

  'feature-detects': [
    'webrtc/getusermedia',
    'css/pointerevents',
    'fullscreen-api',
    'history',
    'webgl'
  ]
}
