import WorldRenderer from './WorldRenderer'
import StandardRenderPass from './postprocessing/StandardRenderPass'
import { EffectComposer } from '@three/postprocessing/EffectComposer'
import { UnrealBloomPass } from '@three/postprocessing/UnrealBloomPass'
import { ShaderPass } from '@three/postprocessing/ShaderPass'
import { FXAAShader } from '@three/shaders/FXAAShader'
import { SMAAPass } from '@three/postprocessing/SMAAPass'
import { Vector2 } from '@three/math/Vector2'
import { Color } from '@three/math/Color'
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
  name: 'StandardWorldRenderer',

  mixins: [WorldRenderer],

  data () {
    return {
      renderScenePass: null,
      bloomPass: null,
      FXAAPass: null,
      SMAAPass: null,
      worldNeedsMaterialUpdate: false,
      // define defaults
      // these can be interpolated between scenes
      // these will also be reactive properties
      defaults: {
        renderer: {
          gammaInput: true,
          gammaOutput: true,
          gammaFactor: 2,
          physicallyCorrectLights: false,
          shadowMap: {
            enabled: false
          },
          sortObjects: true,
          toneMappingExposure: 1,
          toneMappingWhitePoint: 1
        },
        // passes
        renderScenePass: {
          enabled: true,
          renderToScreen: false,
          useTexture: false,
          mixTexture: null,
          threshold: 0.1,
          clearAlpha: 0,
          clearColor: new Color(0xffffff)
        },
        bloomPass: {
          strength: 1,
          radius: 0.4,
          threshold: 0.85,
          renderToScreen: false
        },
        FXAAPass: {
          enabled: true,
          renderToScreen: true
        },
        SMAAPass: {
          enabled: false,
          renderToScreen: true
        },
        save: this.saveState,
        load: this.loadState
      }
    }
  },

  watch: {
    'renderer.gammaInput': function () { this.scheduleMaterialUpdate() },
    'renderer.gammaOutput': function () { this.scheduleMaterialUpdate() },
    'renderer.gammaFactor': function () { this.scheduleMaterialUpdate() },
    'renderer.shadowMap.enabled': function () { this.scheduleMaterialUpdate() },
    'renderer.physicallyCorrectLights': function () { this.scheduleMaterialUpdate() }
  },

  created () {
    this.composer = new EffectComposer(this.renderer)

    let renderScenePass = merge(new StandardRenderPass({width: this.width, height: this.height}), this.defaults.renderScenePass)
    this.assignReactive(this, 'renderScenePass', renderScenePass, this.defaults.renderScenePass)
    this.composer.addPass(this.renderScenePass)

    let bloomPass = merge(new UnrealBloomPass(new Vector2(this.width, this.height), 0, 0, 0), this.defaults.bloomPass)
    this.assignReactive(this, 'bloomPass', bloomPass, this.defaults.bloomPass)
    this.composer.addPass(this.bloomPass)

    let FXAAPass = merge(new ShaderPass(FXAAShader), this.defaults.FXAAPass)
    this.assignReactive(this, 'FXAAPass', FXAAPass, this.defaults.FXAAPass)
    this.FXAAPass.uniforms.resolution.value.set(1 / this.width, 1 / this.height)
    this.FXAAPass.renderToScreen = true
    this.composer.addPass(this.FXAAPass)

    let SmaaPass = merge(new SMAAPass(this.width, this.height), this.defaults.SMAAPass)
    this.assignReactive(this, 'SMAAPass', SmaaPass, this.defaults.SMAAPass)
    this.composer.addPass(this.SMAAPass)

    this.handleResize()
  },

  methods: {
    scheduleMaterialUpdate () {
      this.worldNeedsMaterialUpdate = true
    },

    dispose () {
      // call World mixin method
      WorldRenderer.methods.dispose.bind(this)()
      this.renderScenePass.dispose()
    },

    handleResize () {
      // call World mixin method
      WorldRenderer.methods.handleResize.bind(this)()
      // this calls setSize in all passes
      this.composer.setSize(this.width, this.height)
      this.FXAAPass.uniforms.resolution.value.set(1 / this.width, 1 / this.height)
    },

    render (world1, world2, alpha) {
      this.bloomPass.enabled = this.bloomPass.strength > 0.001

      if (this.worldNeedsMaterialUpdate) {
        // console.log('materials update')
        this.renderScenePass.quadmaterial.needsUpdate = true

        this.bloomPass.basic.needsUpdate = true
        this.bloomPass.compositeMaterial.needsUpdate = true
        this.bloomPass.materialCopy.needsUpdate = true
        this.bloomPass.materialHighPassFilter.needsUpdate = true

        this.FXAAPass.material.needsUpdate = true

        this.SMAAPass.materialBlend.needsUpdate = true
        this.SMAAPass.materialEdges.needsUpdate = true
        this.SMAAPass.materialWeights.needsUpdate = true

        if (world1) world1.handleMaterialsUpdate()
        if (world2) world2.handleMaterialsUpdate()
        this.worldNeedsMaterialUpdate = false
      }

      this.renderScenePass.alpha = alpha
      if (world1) {
        this.renderScenePass.setScene1(world1.scene, world1.camera)
      }
      if (world2) {
        this.renderScenePass.setScene2(world2.scene, world2.camera)
      }
      this.composer.render()
    }
  }
}
