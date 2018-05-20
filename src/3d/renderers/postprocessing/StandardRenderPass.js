import { Pass } from '@three/postprocessing/Pass'
import { OrthographicCamera } from '@three/cameras/OrthographicCamera'
import { Scene } from '@three/scenes/Scene'
import { LinearFilter, RGBAFormat } from '@three/constants'
import { Mesh } from '@three/objects/Mesh'
import { WebGLRenderTarget } from '@three/renderers/WebGLRenderTarget'
import { ShaderMaterial } from '@three/materials/ShaderMaterial'
import { PlaneBufferGeometry } from '@three/geometries/PlaneGeometry'

import vertexShader from './StandardRenderShader.vert'
import fragmentShader from './StandardRenderShader.frag'
/*
 * TODO: documentation
 *
 *
 *
 *
 *
 */
export default class StandardRenderPass extends Pass {
  constructor ({scene1, camera1, scene2, camera2, width, height, clearColor, clearAlpha}) {
    super()

    this.camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10, 10)
    this.scene = new Scene()

    let renderTargetParameters = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: false
    }
    this.clear = true
    this.clearDepth = false
    this.needsSwap = false

    this.width = width
    this.height = height
    this.scene1 = scene1
    this.camera1 = camera1
    this.scene2 = scene2
    this.camera2 = camera2
    this.alpha = 0
    this.clearColor = clearColor
    this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0

    this._useTexture = false
    this._threshold = 0.1
    this._mixTexture = null

    this.fbo1 = new WebGLRenderTarget(width, height, renderTargetParameters)
    this.fbo2 = new WebGLRenderTarget(width, height, renderTargetParameters)

    this.quadmaterial = new ShaderMaterial({
      uniforms: {
        tDiffuse1: {
          value: this.fbo1.texture
        },
        tDiffuse2: {
          value: this.fbo2.texture
        },
        mixRatio: {
          value: 0.0
        },
        threshold: {
          value: this._threshold
        },
        useTexture: {
          value: this._useTexture
        },
        tMixTexture: {
          value: this._mixTexture
        }
      },
      vertexShader,
      fragmentShader
    })
    this.quad = new Mesh(new PlaneBufferGeometry(width, height), this.quadmaterial)
    this.quad.frustumCulled = false // Avoid getting clipped
    this.scene.add(this.quad)
  }

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    this.quadmaterial.uniforms.mixRatio.value = 1 - this.alpha
    // save
    let oldAutoClear = renderer.autoClear
    renderer.autoClear = false
    let oldClearColor
    let oldClearAlpha
    if (this.clearColor) {
      oldClearColor = renderer.getClearColor().getHex()
      oldClearAlpha = renderer.getClearAlpha()
      renderer.setClearColor(this.clearColor, this.clearAlpha)
    }

    // draw
    if (this.alpha === 0) {
      if (this.scene1 && this.camera1) renderer.render(this.scene1, this.camera1, this.renderToScreen ? null : readBuffer, this.clear)
    } else if (this.alpha === 1) {
      if (this.scene2 && this.camera2) renderer.render(this.scene2, this.camera2, this.renderToScreen ? null : readBuffer, this.clear)
    } else {
      if (this.scene1 && this.camera1) renderer.render(this.scene1, this.camera1, this.fbo1, true)
      if (this.scene2 && this.camera2) renderer.render(this.scene2, this.camera2, this.fbo2, true)
      renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear)
    }
    // restore
    if (this.clearColor) {
      renderer.setClearColor(oldClearColor, oldClearAlpha)
    }
    renderer.autoClear = oldAutoClear
  }

  get useTexture () {
    return this._useTexture
  }
  set useTexture (value) {
    this._useTexture = value
    this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0
  }
  get threshold () {
    return this._threshold
  }
  set threshold (value) {
    this._threshold = value
    this.quadmaterial.uniforms.threshold.value = value
  }
  get mixTexture () {
    return this._mixTexture
  }
  set mixTexture (value) {
    this._mixTexture = value
    this.quadmaterial.uniforms.tMixTexture.value = value
  }

  dispose () {
    if (this.quadmaterial.uniforms.tDiffuse1.value) this.quadmaterial.uniforms.tDiffuse1.value.dispose()
    if (this.quadmaterial.uniforms.tDiffuse2.value) this.quadmaterial.uniforms.tDiffuse2.value.dispose()
    if (this.quadmaterial.uniforms.tMixTexture.value) this.quadmaterial.uniforms.tMixTexture.value.dispose()
    this.quadmaterial.dispose()
    this.quad.geometry.dispose()
  }

  setScene1 (scene1, camera1) {
    this.scene1 = scene1
    this.camera1 = camera1
  }

  setScene2 (scene2, camera2) {
    this.scene2 = scene2
    this.camera2 = camera2
  }

  setSize (width, height) {
    this.fbo1.setSize(width, height)
    this.fbo2.setSize(width, height)
    // this.camera.left = width / -2
    // this.camera.right = width / 2
    // this.camera.top = height / 2
    // this.camera.bottom = height / -2
    // if (this.quad.geometry) this.quad.geometry.dispose()
    // this.quad.geometry = new PlaneBufferGeometry(width * 0.2, height * 0.2)
    // this.quad.geometry.needsUpdate = true
  }
}
