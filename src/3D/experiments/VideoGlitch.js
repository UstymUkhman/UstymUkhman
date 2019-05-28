import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial'
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { PlaneGeometry } from '@three/geometries/PlaneGeometry'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'

import { EffectComposer } from '@three/postprocessing/EffectComposer'
import { ShaderMaterial } from '@three/materials/ShaderMaterial'
import { RenderPass } from '@three/postprocessing/RenderPass'
import { ShaderPass } from '@three/postprocessing/ShaderPass'
import { CopyShader } from '@three/shaders/CopyShader'

import vertGlitch from '@/3D/glsl/VideoGlitch/glitch.vert'
import fragGlitch from '@/3D/glsl/VideoGlitch/glitch.frag'

import { LinearFilter } from '@three/constants.js'
import { removeDatGui } from '@/utils/utilities'

import { Texture } from '@three/textures/Texture'
import { Scene } from '@three/scenes/Scene'
import { Mesh } from '@three/objects/Mesh'
import { Color } from '@three/math/Color'

import * as dat from 'dat.gui'

export default class VideoGlitch {
  constructor () {
    this.width = 1920
    this.height = 1080

    this.container = null
    this.gui = new dat.GUI()
    this.setFullscreenMethods()

    this.ratio = this.width / this.height
    this.overlay = new Color(0, 0, 0)
  }

  startExperiment (container) {
    this.createVideoStream('lake')

    this.container = container
    this.container.appendChild(this.video)
  }

  createVideoStream (file) {
    this.video = document.createElement('video')
    this.video.src = `/static/video/${file}.mp4`

    this.video.loop = true
    this.video.muted = true
    this.video.preload = true

    this.video.width = this.width
    this.video.height = this.height

    this.video.oncanplay = this.init.bind(this)
  }

  init () {
    if (this.renderer) return

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    })

    this.createWebGLEnvironment()
    this.createVideoGeometry()
    this.createGlitchParams()

    this.createGlitchShader()
    this.createControls()
    this.video.play()
    this.render()
  }

  createWebGLEnvironment () {
    this.scene = new Scene()

    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 10000)
    this.camera.position.z = Math.round(this.height / 0.8275862)
    this.camera.updateProjectionMatrix()

    this.renderer.domElement.id = 'video-canvas'
    this.renderer.setSize(this.width, this.height)
    this.container.appendChild(this.renderer.domElement)
    this.renderer.setPixelRatio(window.devicePixelRatio || 1.0)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
  }

  createVideoGeometry () {
    this.videoTexture = new Texture(this.video)

    this.videoTexture.minFilter = LinearFilter
    this.videoTexture.magFilter = LinearFilter

    this.scene.add(new Mesh(
      new PlaneGeometry(this.width, this.height, 1, 1),
      new MeshBasicMaterial({ map: this.videoTexture })
    ))
  }

  createGlitchParams () {
    this.effects = {
      overlay: new Color(0.0),
      color: '#000000',
      lines: false,
      video: true,

      noise: 0.0,
      alpha: 1.0,
      blur: 0.0,
      time: 0.0,
      size: 1.0,

      distortion: {
        amount: 0.0,
        speed: 0.0
      },

      rgbShift: {
        amount: 0.0,
        angle: 0.0
      },

      offset: {
        x: 0.0,
        y: 0.0
      }
    }
  }

  createGlitchShader () {
    const copyPass = new ShaderPass(CopyShader)

    this.glitchUniforms = {
      distortion: { type: 'f', value: this.effects.distortion.amount },
      speed: { type: 'f', value: this.effects.distortion.speed },

      shift: { type: 'f', value: this.effects.rgbShift.amount },
      angle: { type: 'f', value: this.effects.rgbShift.angle },

      offsetX: { type: 'f', value: this.effects.offset.x },
      offsetY: { type: 'f', value: this.effects.offset.y },

      blur: { type: 'f', value: this.effects.blur / 512.0 },
      overlay: { type: 'c', value: this.effects.overlay },
      noise: { type: 'f', value: this.effects.noise },

      lines: { type: 'i', value: ~~this.effects.lines },
      size: { type: 'f', value: this.effects.size },

      time: { type: 'f', value: this.effects.time },
      tDiffuse: { type: 't', value: null }
    }

    this.glitch = new ShaderPass(
      new ShaderMaterial({
        uniforms: this.glitchUniforms,
        fragmentShader: fragGlitch,
        vertexShader: vertGlitch
      })
    )

    this.composer.addPass(copyPass)
    this.glitch.renderToScreen = true
    this.composer.addPass(this.glitch)
  }

  createControls () {
    const distortion = this.gui.addFolder('Distortion')
    const rgbShift = this.gui.addFolder('RGB Shift')
    const offset = this.gui.addFolder('Offset')

    distortion.open()
    rgbShift.open()
    offset.open()

    distortion.add(this.effects.distortion, 'amount', 0.0, 1.0).step(0.01).name('Amount').onChange(amount => {
      this.glitchUniforms.distortion.value = amount
    })

    distortion.add(this.effects.distortion, 'speed', 0.0, 1.0).step(0.01).name('Speed').onChange(speed => {
      this.glitchUniforms.speed.value = speed / 200.0
    })

    rgbShift.add(this.effects.rgbShift, 'amount', 0.0, 1.0).step(0.01).name('Amount').onChange(amount => {
      this.glitch.material.uniforms.shift.value = amount
    })

    rgbShift.add(this.effects.rgbShift, 'angle', 0.0, 2.0).step(0.01).name('Angle').onChange(angle => {
      this.glitch.material.uniforms.angle.value = angle * Math.PI
    })

    offset.add(this.effects.offset, 'x', -1.0, 1.0).step(0.01).name('Horizontal').onChange(x => {
      this.glitchUniforms.offsetX.value = x
    })

    offset.add(this.effects.offset, 'y', -1.0, 1.0).step(0.01).name('Vertical').onChange(y => {
      this.glitchUniforms.offsetY.value = y
    })

    this.gui.addColor(this.effects, 'color').name('Overlay').onChange(color => {
      this.glitch.material.uniforms.overlay.value = this.overlay.set(color)
    })

    this.gui.add(this.effects, 'alpha', 0.0, 1.0).step(0.01).name('Alpha').onChange(alpha => {
      this.renderer.domElement.style.opacity = alpha
    })

    this.gui.add(this.effects, 'noise', 0.0, 1.0).step(0.01).name('Noise').onChange(noise => {
      this.glitchUniforms.noise.value = noise
    })

    this.gui.add(this.effects, 'size', 1.0, 2.0).step(0.01).name('Size').onChange(size => {
      this.glitchUniforms.size.value = size
    })

    this.gui.add(this.effects, 'blur', 0.0, 1.0).step(0.01).name('Blur').onChange(blur => {
      this.glitchUniforms.blur.value = blur
    })

    this.gui.add(this.effects, 'lines').name('Lines').onChange(visible => {
      this.glitchUniforms.lines.value = visible ? 1 : 0
    })

    this.gui.add(this.effects, 'video').name('Video').onChange(visible => {
      this.video.style.opacity = ~~visible
    })

    this.fullscreen = this.gui.add(this, 'toggleFullscreen').name('Enter Fullscreen')
    removeDatGui()
  }

  render (delta) {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoTexture.needsUpdate = true
      this.composer.render()
    }

    this.frame = requestAnimationFrame(this.render.bind(this))
    this.glitchUniforms.time.value = delta
  }

  toggleFullscreen () {
    const isFullscreen = this.isFullscreen()
    const action = isFullscreen ? 'Enter' : 'Exit'

    if (!isFullscreen) {
      document.body.requestFullscreen()
    } else {
      document.exitFullscreen()
    }

    this.fullscreen.__li.innerText = `${action} Fullscreen`
  }

  setFullscreenMethods () {
    document.exitFullscreen =
      document.exitFullscreen ||
      document.msExitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitCancelFullScreen

    document.body.requestFullscreen =
      document.body.requestFullscreen ||
      document.body.msRequestFullscreen ||
      document.body.mozRequestFullScreen ||
      document.body.webkitRequestFullscreen
  }

  isFullscreen () {
    return !!document.webkitFullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.msFullscreenElement ||
      !!document.fullscreenElement
  }

  onResize (width, height) {
    this.width = width
    this.height = height

    this.video.width = width
    this.video.height = height

    this.ratio = width / height

    if (this.renderer) {
      this.renderer.setSize(width, height)
    }

    if (this.camera) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
  }

  destroy () {
    cancelAnimationFrame(this.frame)

    this.renderer.domElement.remove()
    this.gui.domElement.remove()
    this.video.remove()

    delete this.container
    delete this.renderer
    delete this.video
    delete this.gui
  }
}
