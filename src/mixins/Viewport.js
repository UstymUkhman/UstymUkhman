import _debounce from 'lodash/debounce'

//
//
// use this mixin when you want a component to be aware of the window.innerWidth and window.innerHeight
//
// USAGE:
//
// watch : {
//   viewPort: function (value) {
//      console.log(value.width, value.height)
//   }
// }
// to observe window size and react accordingly
//
//
export default {

  data: function () {
    return {
      viewPort: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },

  mounted: function () {
    this.__updateViewPort = _debounce(this.__updateViewPort, 50)
    window.addEventListener('resize', this.__updateViewPort)
    this.__updateViewPort()
  },

  activated: function () {
    window.addEventListener('resize', this.__updateViewPort)
    this.__updateViewPort()
  },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.__updateViewPort)
  },

  deactivated: function () {
    window.removeEventListener('resize', this.__updateViewPort)
  },

  methods: {
    __updateViewPort: function () {
      // console.log(this.$options.name, 'on resize')
      this.viewPort = {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
}
