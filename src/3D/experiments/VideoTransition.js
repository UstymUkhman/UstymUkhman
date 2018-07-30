import vertTransition from '@/3D/glsl/VideoTransition/transition.vert'
import fragTransition from '@/3D/glsl/VideoTransition/transition.frag'

export default class VideoTransition {
  constructor (planeElement) {
    this.pixelRatio = window.devicePixelRatio || 1.0
    this.planeElement = planeElement
    this.activeTexture = false

    this.transitionTimer = 0
    this.loadedVideos = 0

    this.plane = new window.Curtains('canvas').addPlane(this.planeElement, {
      fragmentShader: fragTransition,
      vertexShader: vertTransition,

      uniforms: {
        minRadius: {
          value: this.planeElement.clientWidth / 15,
          name: 'minRadius',
          type: '1f'
        },

        maxRadius: {
          value: this.planeElement.clientWidth / 5,
          name: 'maxRadius',
          type: '1f'
        },

        transitionTimer: {
          name: 'transitionTimer',
          type: '1f',
          value: 0
        },

        mousePosition: {
          name: 'mousePosition',
          value: [0, 0],
          type: '2f'
        },

        resolution: {
          name: 'resolution',
          value: [0, 0],
          type: '2f'
        }
      }
    })

    this.plane.onReady(this.onPlaneReady.bind(this)).onRender(this.onPlaneRender.bind(this))

    planeElement.children[1].addEventListener('canplay', this.onReady.bind(this))
    planeElement.children[1].addEventListener('canplay', this.onReady.bind(this))
  }

  onPlaneReady () {
    this.plane.setPerspective(35)
    this.planeElement.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.planeElement.addEventListener('mouseup', this.toggleActiveTexture.bind(this))
    this.planeElement.addEventListener('mousedown', this.toggleActiveTexture.bind(this))
  }

  toggleActiveTexture (event) {
    this.activeTexture = !this.activeTexture
  }

  onMouseMove (event) {
    this.plane.uniforms.mousePosition.value = [event.clientX, this.planeElement.clientHeight + 120 - event.clientY]
  }

  onPlaneRender () {
    this.transitionTimer = this.activeTexture ? Math.min(90, this.transitionTimer + 1) : Math.max(0, this.transitionTimer - 1)
    this.plane.uniforms.transitionTimer.value = this.transitionTimer
  }

  onReady (event) {
    if (event.type === 'canplay') {
      this.loadedVideos++
    }

    if (this.loadedVideos === 2) {
      this.plane.playVideos()
    }
  }

  onResize () {
    this.plane.uniforms.minRadius.value = this.planeElement.clientWidth / 15
    this.plane.uniforms.maxRadius.value = this.planeElement.clientWidth / 5

    this.plane.uniforms.resolution.value = [
      this.pixelRatio * this.planeElement.clientWidth,
      this.pixelRatio * this.planeElement.clientHeight
    ]
  }

  destroy () {
    this.planeElement = null
    delete this.plane
  }
}
