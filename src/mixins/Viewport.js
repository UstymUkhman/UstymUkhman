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
      this.viewPort = {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
}
