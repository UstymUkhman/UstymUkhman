import Fbo from '@/3D/utils/FBO'
import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE)

export default class Particles {
  constructor (container, overlay) {
    this.simulationShader = null
    this.renderShader = null
    this.startTime = null
    this.pressed = null

    this.container = container
    this.overlay = overlay

    this.lightSpeed = 0.0
    this.distance = 50.0
    this.speed = 10.0

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.createScene()
    this.createCamera()
    this.createRenderer()

    this.createOrbitControls()
    this.bindEvents()

    this.createParticles()
    this.createSphere()
  }

  createScene () {
    this.scene = new THREE.Scene()
  }

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 500
  }

  createRenderer () {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.container.appendChild(this.renderer.domElement)
  }

  createOrbitControls () {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  getSphere (size, length) {
    const data = new Float32Array(length)
    const point = new THREE.Vector3()

    for (let i = 0; i < length; i += 3) {
      this.getPoint(point, size)

      data[i] = point.x
      data[i + 1] = point.y
      data[i + 2] = point.z
    }

    return data
  }

  getPoint (vertex, size) {
    vertex.x = Math.random() * 2 - 1
    vertex.y = Math.random() * 2 - 1
    vertex.z = Math.random() * 2 - 1

    if (vertex.length() > 1) {
      return this.getPoint(vertex, size)
    }

    return vertex.normalize().multiplyScalar(size)
  }

  createSphere () {
    const loader = new THREE.TextureLoader()

    loader.load('/static/img/white.jpg',
      (white) => {
        loader.load('/static/img/black.jpg',
          (black) => {
            this.sphereMaterial = new THREE.ShaderMaterial({
              fragmentShader: require('../../3D/glsl/FBO/noise/sphere.frag'),
              vertexShader: require('../../3D/glsl/FBO/noise/sphere.vert'),
              shading: THREE.SmoothShading,

              uniforms: {
                progress: { type: 'f', value: 0.0 },
                white: { type: 't', value: white },
                black: { type: 't', value: black }
              }
            })

            this.sphere = new THREE.Mesh(
              new THREE.SphereGeometry(1, 32, 32),
              this.sphereMaterial
            )

            this.wireframes = new THREE.LineSegments(
              new THREE.WireframeGeometry(this.sphere.geometry),
              new THREE.LineBasicMaterial({
                transparent: true,
                color: 0xFFFFFF,
                linewidth: 1
              })
            )

            this.sphere.position.set(0, 0, 0)
            this.sphere.add(this.wireframes)
            this.scene.add(this.sphere)
            this.update()
          }
        )
      }
    )
  }

  createParticles () {
    const size = 512
    const length = Math.pow(size, 2) * 3

    const data = this.getSphere(size / 4, length)
    const texture = new THREE.DataTexture(
      data, size, size,
      THREE.RGBFormat,
      THREE.FloatType,
      THREE.DEFAULT_MAPPING,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping
    )

    this.particleColor = new THREE.Vector3(0.0, 0.0, 0.0)

    this.controls.minDistance = 400
    this.controls.maxDistance = 400

    this.camera.position.z = 400
    texture.needsUpdate = true

    this.simulationShader = new THREE.ShaderMaterial({
      fragmentShader: require('../../3D/glsl/FBO/noise/particles.frag'),
      vertexShader: require('../../3D/glsl/FBO/noise/particles.vert'),

      uniforms: {
        distance: { type: 'f', value: this.distance },
        speed: { type: 'f', value: this.speed },
        texture: { type: 't', value: texture },
        timer: { type: 'f', value: 0.0 }
      }
    })

    this.renderShader = new THREE.ShaderMaterial({
      fragmentShader: require('../../3D/glsl/FBO/noise/render.frag'),
      vertexShader: require('../../3D/glsl/FBO/noise/render.vert'),

      uniforms: {
        color: { type: 'v3', value: this.particleColor },
        positions: { type: 't', value: null }
      },

      side: THREE.DoubleSide,
      transparent: true
    })

    this.fbo = new Fbo(
      size, size, this.renderer,
      this.simulationShader, this.renderShader
    )

    this.scene.add(this.fbo.particles)
    this.startTime = 0.0
  }

  update () {
    const angle = Math.PI / 180

    this.fbo.particles.rotation.y -= angle * 0.1
    this.fbo.update()

    this.simulationShader.uniforms.distance.value = this.distance
    this.simulationShader.uniforms.speed.value = this.speed
    this.simulationShader.uniforms.timer.value += 0.01

    const time = Math.cos(Date.now() * 0.001)
    this.fbo.particles.rotation.x = time * angle * 2.0

    this.updateSphereAspect(time)

    if (this.pressed === null) {
      if (this.lightSpeed > 0) this.lightSpeed -= 0.05
      if (this.distance > 90) this.distance -= 1.5
      if (this.speed > 10) this.speed -= 4.0

      const step = this.speed > 10 ? 0.002 : 0.01

      if (this.particleColor.x > 0.0) {
        this.particleColor.x -= step
        this.particleColor.y -= step
        this.particleColor.z -= step
      }
    } else {
      this.animate()
    }

    this.renderer.render(this.scene, this.camera)
    this.frame = requestAnimationFrame(this.update.bind(this))
  }

  updateSphereAspect (time) {
    this.startTime += 0.1

    if (this.lightSpeed <= 0.0) {
      this.lightSpeed = 0.0
      this.startTime = 0.0
    } else if (this.lightSpeed > 20.0) {
      this.lightSpeed = 20.0
    }

    const progress = this.lightSpeed / 20.0
    const hex = 1 - progress

    this.wireframes.material.opacity = Math.max(0.5 - progress, 0.25)
    this.wireframes.material.color = new THREE.Color(hex, hex, hex)

    let scale = this.lightSpeed * 4.0 + 20

    if (!this.pressed) {
      scale -= 0.5
    }

    this.sphereMaterial.uniforms.progress.value = progress
    this.sphere.rotation.y += this.lightSpeed / 50.0
    this.sphere.scale.set(scale, scale, scale)
    this.overlay.style.opacity = hex
  }

  animate (pressed = false) {
    const frac = this.pressed === null ? 1 : 2.5
    const delay = Date.now() - this.pressed
    const power = delay / frac * 0.0005

    if (this.particleColor.x < 0.7529411764705882) {
      this.particleColor.x += 0.001
      this.particleColor.y += 0.001
      this.particleColor.z += 0.001
    }

    this.speed = power * 340 + 10
    this.distance = power * 20 + 90
    this.lightSpeed = power * 5
  }

  bindEvents () {
    this.renderer.domElement.addEventListener('contextmenu', this.onMouseDown.bind(this))
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  onMouseDown (event) {
    if (event.which === 1) {
      this.onLeftPress()
    } else if (event.which === 3) {
      event.preventDefault()
      event.stopPropagation()
      this.controls.enabled = false
    }
  }

  onMouseUp (event) {
    if (event.which === 1) {
      this.onLeftRelease()
    } else if (event.which === 3) {
      this.controls.enabled = true
    }
  }

  onLeftPress (event) {
    if (this.lightSpeed) {
      return
    }

    const now = Date.now()
    this.down = now

    if (this.pressed === null) {
      this.pressed = now
    }

    this.animate(true)
  }

  onLeftRelease (event) {
    const delay = !(this.down - this.pressed) ? 1000 : 0

    if (Date.now() - this.down >= 1000) {
      this.pressed = null
    }

    setTimeout(() => {
      this.pressed = null
    }, delay)
  }

  onResize () {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.renderer.setSize(this.size.width, this.size.height)

    this.camera.aspect = this.size.width / this.size.height
    this.camera.updateProjectionMatrix()
  }

  destroy () {
    this.renderer.domElement.removeEventListener('contextmenu', this.onMouseDown.bind(this))
    this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this))
    this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this))

    window.removeEventListener('resize', this.onResize.bind(this))
    cancelAnimationFrame(this.frame)

    this.container.removeChild(this.renderer.domElement)
    this.overlay.style.opacity = ''
  }
}
