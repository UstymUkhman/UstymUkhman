export default {
  data: function () {
    return {
      viewPort: {
        width: window.innerWidth,
        height: window.innerHeight
      },

      videoViewPort: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },

  mounted: function () {
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
      let height = window.innerHeight
      let width = window.innerWidth

      if (window.innerWidth > window.innerHeight) {
        height = window.innerWidth / 16 * 9
      } else {
        width = window.innerHeight / 9 * 16
      }

      this.viewPort = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      this.videoViewPort = {
        width: width,
        height: height
      }
    }
  }
}
