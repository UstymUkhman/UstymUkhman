import { WebGLRenderer } from '@three/renderers/WebGLRenderer'
import { downloadFile } from '@/utils/BrowserUtils'
import { Uncharted2ToneMapping, PCFSoftShadowMap } from '@three/constants'
import merge from 'lodash/merge'
/*
 * TODO: documentation
 *
 *
 *
 *
 *
 */
export default {
  name: 'WorldRenderer',

  props: {
    canvas: {
      required: true
    },
    pixelRatio: {
      type: Number,
      required: false,
      default: window.devicePixelRatio
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },

  watch: {
    width () { this.handleResize() },
    height () { this.handleResize() }
  },

  data () {
    return {
      renderer: null
    }
  },

  created () {
    if (this.defaults && this.defaults.renderer) {
      let r = merge(new WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false }), this.defaults.renderer)
      this.assignReactive(this, 'renderer', r, this.defaults.renderer)
    } else {
      let r = new WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false })
      this.assignReactive(this, 'renderer', r, {})
    }
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.toneMapping = Uncharted2ToneMapping
  },

  methods: {
    getObjectState: function (object, model) {
      let result = {}
      for (let prop in model) {
        if (typeof object[prop] !== 'function') {
          if (typeof object[prop] !== 'object') {
            result[prop] = object[prop]
          } else if (object[prop]) {
            result[prop] = this.getObjectState(object[prop], model[prop])
          }
        }
      }
      return result
    },
    saveState () {
      let result = this.getObjectState(this, this.defaults)
      return downloadFile(JSON.stringify(result), 'rendererstate.json', 'text/plain')
    },

    loadState () {
      console.log('load')
    },

    assignReactive (thisObject, key, value, model) {
      let tmpContainer = {}
      // first remove all non-reactive props from value
      for (let prop in value) {
        let modelVal = model[prop]
        if (modelVal === undefined) {
          tmpContainer[prop] = value[prop]
          delete value[prop]
        }
      }
      // assign reactive value (vue will instance observers etc)
      thisObject[key] = value
      // copy all saved properties back to the original object
      for (let prop in tmpContainer) {
        thisObject[key][prop] = tmpContainer[prop]
      }
      tmpContainer = null
    },

    handleResize () {
      this.renderer.setSize(this.width, this.height)
    },

    render (world1, world2, alpha) {
      // simple rendering
      let world
      if (alpha < 0.5) {
        world = world1
      } else {
        world = world2
      }
      this.renderer.setClearColor(world.clearColor)
      this.renderer.setClearAlpha(world.clearAlpha)
      this.renderer.render(world.scene, world.camera)
    },

    dispose () {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
    }
  }
}
