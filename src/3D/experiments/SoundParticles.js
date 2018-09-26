import { Shader, Mesh, Geometry, Container, DRAW_MODES } from 'pixi.js'
import { autoDetectRenderer } from 'pixi.js-legacy'
import { mat4 } from 'gl-matrix'

import OrbitalCameraControl from '@/3D/utils/OrbitalCameraControl'
import AudioReactive from '@/3D/utils/AudioReactive'
import { Detector } from '@three/helpers/Detector'

import vertLowParticles from '@/3D/glsl/SoundParticles/particles-low.vert'
import vertParticles from '@/3D/glsl/SoundParticles/particles.vert'
import fragParticles from '@/3D/glsl/SoundParticles/particles.frag'

import vertBackground from '@/3D/glsl/SoundParticles/background.vert'
import fragBackground from '@/3D/glsl/SoundParticles/background.frag'

const RAD = Math.PI / 180

export default class SoundParticles {
  constructor (container, track, lowPerformance = false) {
    const fftSize = lowPerformance ? 256 : null

    this._container = container
    this._audio = new AudioReactive(track, fftSize)
    this._audio.setSongFrequencies({ min: 510.5, max: 621.5 })

    this._height = window.innerHeight
    this._width = window.innerWidth

    this.PARTICLES = lowPerformance ? 128 : 1024
    this._ratio = this._width / this._height
    this._low = lowPerformance

    this._destroyed = false
    this._startTime = null

    return !!Detector.webgl
  }

  _createBackground () {
    const position = [-1, 1, -0.5, 1, 1, -0.5, 1, -1, -0.5, -1, -1, -0.5]
    const indices = [0, 1, 2, 0, 2, 3]
    const uvs = [0, 0, 1, 0, 1, 1, 0, 1]

    const geometry = new Geometry()
      .addAttribute('position', position, 3)
      .addAttribute('uv', uvs, 2)
      .addIndex(indices)

    this._backgroundUniforms = {
      aspect: this._ratio,
      progress: 0.0,
      dark: true
    }

    const shader = Shader.from(vertBackground, fragBackground, this._backgroundUniforms)
    const mesh = new Mesh(geometry, shader)

    this._stage.addChild(mesh)
  }

  _shuffleIndices (indices) {
    let index = indices.length

    while (index > 0) {
      const rand = Math.floor(Math.random() * index)

      index -= 1

      const temp = indices[index]

      indices[index] = indices[rand]
      indices[rand] = temp
    }
  }

  _createParticles () {
    let random = Math.random() * this.PARTICLES
    let particlesOffset = 2.0 / this.PARTICLES

    let step = Math.PI * (5.0 - Math.sqrt(5))
    const distance = this._low ? 3.0 : 1.5

    let minFrequencies = []
    let maxFrequencies = []
    let frequencies = []
    let indices = []

    for (let i = 0; i < this.PARTICLES; i++) {
      let minY = ((i * particlesOffset) - 1) + (particlesOffset / 2)
      const radius = Math.sqrt(1 - Math.pow(minY, 2))
      const phi = ((i + random) % this.PARTICLES) * step

      let minX = Math.cos(phi) * radius
      let minZ = Math.sin(phi) * radius

      minX /= distance
      minY /= distance
      minZ /= distance

      const maxX = minX * 2.0
      const maxY = minY * 2.0
      const maxZ = minZ * 2.0

      minFrequencies = minFrequencies.concat([minX, minY, minZ])
      maxFrequencies = maxFrequencies.concat([maxX, maxY, maxZ])

      frequencies.push(i / this.PARTICLES)
      indices.push(i)
    }

    const view = this._view
    const proj = this._proj

    this._shuffleIndices(indices)

    this._particleUniforms = {
      frequencies: frequencies,
      easing: 0.0,
      time: 0.0,
      proj,
      view
    }

    const particlesGeometry = new Geometry()
      .addAttribute('startPosition', minFrequencies, 3)
      .addAttribute('endPosition', maxFrequencies, 3)
      .addAttribute('index', indices)
      .addIndex(indices)

    const shaderRender = Shader.from(this._low ? vertLowParticles : vertParticles, fragParticles, this._particleUniforms)
    const particles = new Mesh(particlesGeometry, shaderRender, null, DRAW_MODES.POINTS)

    particles.state.depthTest = true
    this._stage.addChild(particles)
  }

  _render () {
    if (this._destroyed) {
      return
    }

    const progTime = Math.abs(this._startTime - Date.now()) / 1000

    if (this._runEasing && progTime > 48.5) {
      this._backgroundUniforms.dark = false
      this._particleUniforms.easing = 0.0
      this._runEasing = false
    } else if (this._runEasing && progTime > 44.6) {
      this._particleUniforms.easing = 44.6
    } else if (progTime > 40.8 && progTime < 48.5) {
      this._particleUniforms.easing = -40.8
      this._runEasing = true
    }

    this._particleUniforms.time = progTime
    this._particleUniforms.frequencies = this._audio.getFrequencyValues()

    this._backgroundUniforms.progress = this._audio.getAudioProgress()

    this._camera.update()
    this._renderer.render(this._stage)
    this._frame = requestAnimationFrame(this._render.bind(this))
  }

  startExperiment () {
    this._view = mat4.create()
    this._proj = mat4.create()

    mat4.perspective(this._proj, 45 * RAD, this._ratio, 0.1, 100)

    this._stage = new Container()
    this._renderer = autoDetectRenderer(
      this._width, this._height, {
        transparent: true,
        antialias: true
      }
    )

    this._camera = new OrbitalCameraControl(this._view, 5)

    if (this._container) {
      this._container.appendChild(this._renderer.view)
    }

    this._createBackground()
    this._createParticles()

    this._runEasing = false
    this._startTime = Date.now()
    this._audio.play(this._render.bind(this))
  }

  onResize () {
    this._width = window.innerWidth
    this._height = window.innerHeight

    this._ratio = this._width / this._height
    this._backgroundUniforms.aspect = this._ratio

    this._renderer.view.style.width = `${this._width}px`
    this._renderer.view.style.height = `${this._height}px`

    mat4.perspective(this._proj, 45 * RAD, this._ratio, 0.1, 100)
  }

  destroy () {
    cancelAnimationFrame(this._frame)

    this._audio._soundSource.pause()
    this._audio._soundSource.remove()
    this._audio._soundSource = null
    this._audio = null

    this._renderer.view.remove()
    this._destroyed = true
  }
}
