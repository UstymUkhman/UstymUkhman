import Platform from './platform'

export default {
  // avoid touching the actual element on the HTML
  // if this is a prerenderer
  el: !Platform.prerenderer ? '#app-loading-container' : null,
  created: function () {
    // do preloading stuff here
  },
  data: function () {
    return {
      visible: true
    }
  }
}
