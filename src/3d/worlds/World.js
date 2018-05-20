import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { Scene } from '@three/scenes/Scene'
/*
 * TODO: documentation
 *
 *
 *
 *
 *
 */
export default {
  props: {
    width: {
      type: Number,
      required: true,
      default: 800
    },
    height: {
      type: Number,
      required: true,
      default: 600
    }
  },

  data () {
    return {
      isLoaded: false
    }
  },

  created () {
    this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000)
    this.scene = new Scene()

    this.isLoaded = false
  },

  watch: {
    width () { this.handleResize() },
    height () { this.handleResize() }
  },

  methods: {
    update (delta = 1 / 60) {

    },

    load () {
      return new Promise((resolve, reject) => {
        this.isLoaded = true
        resolve()
      })
    },

    intro () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    outro () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    handleMouseUp (event) {

    },

    handleMouseDown (event) {

    },

    handleMouseMove (event) {

    },

    handleMouseWheel (event) {

    },

    handleResize () {
      if (this.camera) {
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
      }
    },

    dispose () {
      if (this.scene) {
        this.scene.traverse(this.destroySceneChildren)
        if (this.scene.background) this.scene.background.dispose()
      }
      this.$destroy()
    },

    destroySceneChildren (value) {
      if (typeof value.dispose === 'function') {
        value.dispose()
      } else {
        if (value.geometry) value.geometry.dispose()

        if (value.material) {
          if (value.material.map) value.material.map.dispose()
          if (value.material.envMap) value.material.envMap.dispose()
          if (value.material.aoMap) value.material.aoMap.dispose()
          if (value.material.alphaMap) value.material.alphaMap.dispose()
          if (value.material.bumpMap) value.material.bumpMap.dispose()
          if (value.material.displacementMap) value.material.displacementMap.dispose()
          if (value.material.emissiveMap) value.material.emissiveMap.dispose()
          if (value.material.lightMap) value.material.lightMap.dispose()
          if (value.material.metalnessMap) value.material.metalnessMap.dispose()
          if (value.material.normalMap) value.material.normalMap.dispose()
          if (value.material.roughnessMap) value.material.roughnessMap.dispose()
          value.material.dispose()
        }
      }
    },

    handleMaterialsUpdate () {
      this.scene.traverse(this.doMaterialUpdate)
    },

    doMaterialUpdate (value) {
      if (value.material) {
        value.material.needsUpdate = true
      }
    }
  }
}
