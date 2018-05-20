<template>
  <div class="canvas-container" ref="container">
    <canvas
      @mousedown="handleMouseDown"
      @mousemove.prevent="handleMouseMove"
      @mouseup="handleMouseUp"
      @touchstart="handleMouseDown"
      @touchmove.prevent="handleMouseMove"
      @touchend="handleMouseUp"
      @mousewheel="handleMouseWheel"
      @DOMMouseScroll="handleMouseWheel"
      ref="canvas"
      />
    <ThreejsStats v-if="debug" class="threejs-stats" />
    <ControlKit
      v-if="debug"
      class="control-kit"
      title="Rendering Options"
      :additionalControls="[threejsControlKit]"
      :model="instantiatedRenderer ? instantiatedRenderer.defaults : null"
      :target="instantiatedRenderer"
      />
  </div>
</template>

<script>
import { Detector } from '@three/helpers/Detector'
import { Clock } from '@three/core/Clock'
import { Vector2 } from '@three/math/Vector2'
import { Vector3 } from '@three/math/Vector3'
import { Vector4 } from '@three/math/Vector4'
import { Color } from '@three/math/Color'
import to from 'await-to-js'
import Vue from 'vue'

import RAF from '@/utils/RAF'
import Platform from '@/platform'
import ElasticNumber from '@/utils/ElasticNumber'
import normalizeWheel from '@/utils/normalizeWheel'
import ControlKit from '@/atoms/ControlKit'
import ThreejsStats from '@/3d/components/ThreejsStats'
import ThreejsControlKit from '@/3d/utils/ThreejsControlKit'
import StandardWorldRenderer from '@/3d/renderers/StandardWorldRenderer'
import { isPlainObject } from '@/utils/ObjectUtils'
import { lerpNumber } from '@/utils/NumberUtils'

export default {
  name: 'ThreejsCanvas',

  components: {
    ControlKit,
    ThreejsStats
  },

  props: {
    debug: {
      type: Boolean,
      required: false,
      default: false
    },
    width: {
      type: Number,
      required: true,
      default: 800
    },
    height: {
      type: Number,
      required: true,
      default: 600
    },
    loading: {
      type: Boolean,
      required: true,
      default: true
    },
    // current world to render
    world: {
      required: false
    },
    // additional data for this world
    // goes to fill the "props" part of the world
    worldData: {
      type: Object,
      required: false
    },
    // type of renderer to use
    renderer: {
      required: false,
      default: function () {
        return StandardWorldRenderer
      }
    }
  },

  data: function () {
    return {
      worlds: [],
      worldAlpha: new ElasticNumber(0), // 0 is worlds[0] 1 is worlds[1]
      alphaThreshold: 0.001,
      transitioning: false,
      instantiatedRenderer: null,
      threejsControlKit: ThreejsControlKit
    }
  },

  created: function () {
    this._clock = new Clock(true)
    this.colorLerp = new Color()
  },

  mounted: async function () {
    if (!Detector.webgl || Platform.prerenderer) {
      return false
    }

    this.instantiateRenderer()
    await this.instantiateWorld()

    this.onResize()
    RAF.add(this.render)
  },

  beforeDestroy: function () {
    if (this.instantiatedRenderer) this.instantiatedRenderer.dispose()
    if (this.worlds[0]) this.worlds[0].dispose()
    if (this.worlds[1]) this.worlds[1].dispose()
    RAF.remove(this.render)
  },

  watch: {
    renderer: function () {
      this.instantiateRenderer()
    },
    world: function () {
      this.instantiateWorld()
    },
    worldData: function () {
      this.instantiateWorld()
    },
    width: function (value) {
      this.onResize()
    },
    height: function (value) {
      this.onResize()
    }
  },

  methods: {
    instantiateWorld: async function () {
      this.transitioning = true

      let newWorldIndex = this.currentWorldIndex === 0 ? 1 : 0
      if (!this.worlds[0] && !this.worlds[1]) {
        // initialization
        newWorldIndex = 0
      } else {
        let outroError
        // signal old world to do outro and wait for it
        [outroError] = await to(this.currentWorld.outro())
        if (outroError) {
          // current world coudn't do outro for some reason
          this.$emit('error', outroError)
          this.transitioning = false
          return
        }
      }
      // dispose of (maybe) instantiated old world
      if (this.worlds[newWorldIndex]) {
        this.worlds[newWorldIndex].dispose()
        delete this.worlds[newWorldIndex]
      }
      // instantiate new world

      let propsData = Object.assign({
        width: this.width,
        height: this.height
      }, this.worldData)

      let worldWithProps = Object.assign(this.world, { propsData })

      let newWorld = this.worlds[newWorldIndex] = new Vue(worldWithProps)

      // give it a pass of lerping
      this.lerpRendererData(
        this.worlds[0] ? this.worlds[0].rendererData : null,
        this.worlds[1] ? this.worlds[1].rendererData : null,
        this.worldAlpha.value,
        this.instantiatedRenderer.defaults,
        this.instantiatedRenderer
      )

      // emit from this
      // all events fired by new world
      let oldEmit = newWorld.$emit
      newWorld.$emit = (...args) => {
        this.$emit.apply(this, args)
        oldEmit.apply(newWorld, args)
      }

      // load new world
      this.$emit('update:loading', true)
      let loadError
      [loadError] = await to(newWorld.load())
      this.$emit('update:loading', false)

      if (!loadError) {
        // transition
        this.worldAlpha.target = newWorldIndex
        // signal new world to do intro
        newWorld.intro()
      } else {
        // new world coudn't load
        this.$emit('error', loadError)
      }
      this.transitioning = false
    },

    instantiateRenderer: function () {
      this.instantiatedRenderer = new Vue(Object.assign(this.renderer, {
        propsData: {
          canvas: this.$refs.canvas,
          width: this.width,
          height: this.height
        }
      }))
      this.onResize()
    },

    render: function () {
      let delta = this._clock.getDelta()
      delta = Math.min(delta, 1 / 40)

      this.worldAlpha.update(delta)
      this.worldAlpha.value = Math.round(this.worldAlpha.value * 10000) / 10000 // round it to 4 decimals

      const [world0, world1] = this.worlds

      // we should lerp renderer data here
      if (world0 && world1) {
        this.lerpRendererData(
          world0 ? world0.rendererData : null,
          world1 ? world1.rendererData : null,
          this.worldAlpha.value,
          this.instantiatedRenderer.defaults,
          this.instantiatedRenderer
        )
      }

      if (this.worldAlpha.value < this.alphaThreshold) {
        // dispose world1
        if (world1 && !this.transitioning) {
          world1.dispose()
          delete this.worlds[1]
        }
        // only update world 1
        world0.update(delta)
      } else if (this.worldAlpha.value > (1 - this.alphaThreshold)) {
        // dispose world0
        if (world0 && !this.transitioning) {
          world0.dispose()
          delete this.worlds[0]
        }
        // only update world 2
        world1.update(delta)
      } else {
        // update both worlds
        world0.update(delta)
        world1.update(delta)
      }

      this.instantiatedRenderer.render(this.worlds[0], this.worlds[1], this.worldAlpha.value)
    },

    lerpRendererData: function (data0, data1, alpha, model, target) {
      for (let prop in model) {
        let modelValue = model[prop]

        let val0 = data0 ? data0[prop] : null
        if (val0 === undefined || val0 === null) val0 = modelValue
        let val1 = data1 ? data1[prop] : null
        if (val1 === undefined || val1 === null) val1 = modelValue

        if (isPlainObject(modelValue)) {
          this.lerpRendererData(val0, val1, alpha, modelValue, target[prop])
        } else {
          if (val0 !== val1) {
            let result
            switch (typeof modelValue) {
              case 'string':
              case 'boolean':
                // strings and booleans are only changed
                // when alpha is close enough to 0 or 1
                if (alpha < this.alphaThreshold) {
                  if (target[prop] !== val0) {
                    result = val0
                  }
                } else if (alpha > (1 - this.alphaThreshold)) {
                  if (target[prop] !== val1) {
                    result = val1
                  }
                }
                break
              case 'number':
                // we can lerp this
                let res = lerpNumber(val0, val1, alpha)
                if (target[prop] !== res) {
                  result = res
                }
                break
              case 'object':
                // see if we can lerp this object
                let type = modelValue ? modelValue.constructor : null
                switch (type) {
                  case Color:
                    let res = this.colorLerp.copy(val0).lerp(val1, alpha)
                    if (res.r !== target[prop].r || res.g !== target[prop].g || res.b !== target[prop].b) {
                      // console.log('lerping', prop, 'on', target)
                      target[prop].copy(res)
                    }
                    break
                  case Vector2:
                  case Vector3:
                  case Vector4:
                    // console.log('lerping', prop, 'on', target)
                    target[prop].lerpVectors(val0, val1, alpha)
                    break
                  default:
                    // can't lerp object, assign it
                    if (alpha < this.alphaThreshold) {
                      result = val0
                    } else if (alpha > (1 - this.alphaThreshold)) {
                      result = val1
                    }
                    break
                }
                break
              default:
                console.warn('[lerp render data] unknown type', typeof modelValue)
                break
            }
            if (result !== undefined && result !== null && result !== target[prop]) {
              // console.log('lerping', prop, 'on', target)
              target[prop] = result
            }
          }
        }
      }
    },
    handleMouseDown: function (event) {
      if (this.currentWorld) this.currentWorld.handleMouseDown(event)
    },
    handleMouseMove: function (event) {
      if (this.currentWorld) this.currentWorld.handleMouseMove(event)
    },
    handleMouseUp: function (event) {
      if (this.currentWorld) this.currentWorld.handleMouseUp(event)
    },
    handleMouseWheel: function (event) {
      if (this.currentWorld) this.currentWorld.handleMouseWheel(Object.assign(event, normalizeWheel(event)))
    },

    onResize: function () {
      // let domRect = this.$refs.container.getBoundingClientRect()
      // console.log(domRect)
      if (this.instantiatedRenderer) {
        this.instantiatedRenderer.width = this.width
        this.instantiatedRenderer.height = this.height
      }
      if (this.worlds[0]) {
        this.worlds[0].width = this.width
        this.worlds[0].height = this.height
      }
      if (this.worlds[1]) {
        this.worlds[1].width = this.width
        this.worlds[1].height = this.height
      }
    }
  },

  computed: {
    currentWorldIndex: function () {
      return Math.round(this.worldAlpha.value)
    },
    currentWorld: function () {
      return this.worlds[this.currentWorldIndex]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'breakpoints';
@import 'app-colors';
@import 'easings';
@import 'mixins';
@import 'sprite';
@import 'z-index';

.canvas-container {
  overflow: hidden;
  box-sizing: border-box;
}

.control-kit {
  position: absolute;
  top: 0;
  right: 5px;
}

.threejs-stats {
  position: absolute;
  top: 10px;
  left: 0;
}
</style>
