<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="pill-choice-page">
    <transition appear name="fade-out">
      <MatrixRain v-if="raining" />
    </transition>

    <MatrixCode :run="goToMenu" />

    <transition appear name="fade-out">
      <div v-if="!fadeOut" ref="pills"></div>
    </transition>
  </article>
</template>

<script>
import {
  Mesh,
  Scene,
  SpotLight,
  JSONLoader,
  AmbientLight,
  WebGLRenderer,
  DirectionalLight,
  PerspectiveCamera,
  MeshStandardMaterial
} from 'three'

import { SmoothShading } from 'three/src/constants.js'

import MatrixRain from '@/molecules/MatrixRain'
import MatrixCode from '@/molecules/MatrixCode'

import Loading from '@/services/Loading'
import Sounds from '@/services/Sounds'
import Platform from '@/platform'

export default {
  name: 'PillChoice',

  components: {
    MatrixRain,
    MatrixCode
  },

  data () {
    return {
      light: null,
      scene: null,
      camera: null,
      renderer: null,

      redPill: null,
      showRed: false,
      bluePill: null,
      showBlue: false,

      choice: null,
      fadeOut: false,
      raining: false,
      goToMenu: false,

      width: window.innerWidth,
      height: window.innerHeight
    }
  },

  methods: {
    createScene () {
      this.scene = new Scene()
    },

    createCamera () {
      this.camera = new PerspectiveCamera(75, this.width / this.height, 1, 10000)
      this.camera.position.z = 7.5
    },

    createLights () {
      this.scene.add(new AmbientLight(0x444444))

      let light = new DirectionalLight(0xFFFFFF, 0.5)
      light.position.set(25, 50, -50)
      light.castShadow = true
      this.scene.add(light)

      light = new SpotLight(0xFFFFFF, 1, 100, 1, 0, 1)
      light.position.set(-25, 25, 5)
      this.scene.add(light)
    },

    createRenderer () {
      this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(this.width, this.height)
      this.renderer.setClearColor(0x000000, 0)

      this.$refs.pills.appendChild(this.renderer.domElement)
    },

    animate () {
      this.frame = requestAnimationFrame(this.animate.bind(this))
      this.renderer.render(this.scene, this.camera)

      if (this.bluePill && this.redPill) {
        if (this.showBlue && this.bluePill.material.opacity < 0.8) {
          this.bluePill.material.opacity += 0.01
        }

        if (this.showRed && this.redPill.material.opacity < 0.8) {
          this.redPill.material.opacity += 0.01
        }

        if (this.choice === false && this.redPill.scale.x > 0.1) {
          this.redPill.scale.x -= 0.005
          this.redPill.scale.y -= 0.005
          this.redPill.scale.z -= 0.005
          this.redPill.material.opacity -= 0.005

          this.bluePill.scale.x += 0.005
          this.bluePill.scale.y += 0.005
          this.bluePill.scale.z += 0.005
          this.bluePill.material.opacity += 0.005
        }

        if (this.choice === true && this.redPill.scale.x < 0.3) {
          this.redPill.scale.x += 0.005
          this.redPill.scale.y += 0.005
          this.redPill.scale.z += 0.005
          this.redPill.material.opacity += 0.005

          this.bluePill.scale.x -= 0.005
          this.bluePill.scale.y -= 0.005
          this.bluePill.scale.z -= 0.005
          this.bluePill.material.opacity -= 0.005
        }

        const redScaleDone = this.redPill.scale.x >= 0.3 && this.bluePill.scale.x <= 0.1
        const blueScaleDone = this.bluePill.scale.x >= 0.3 && this.redPill.scale.x <= 0.1

        if (this.visiblePills && (redScaleDone || blueScaleDone)) {
          cancelAnimationFrame(this.frame)
        }
      }
    },

    animateChosenPill () {
      this.choiceAnimation = requestAnimationFrame(this.animateChosenPill.bind(this))
      this.renderer.render(this.scene, this.camera)

      if (!this.choice && this.bluePill.position.z < 5) {
        this.redPill.material.opacity -= 0.015
        this.bluePill.position.z += 0.0625

        if (this.bluePill.position.x > 0) {
          this.bluePill.position.x -= 0.0625
        }

        if (this.bluePill.rotation.x > 0) {
          this.bluePill.rotation.x += 0.0625
        }

        if (this.bluePill.rotation.z > -0.9) {
          this.bluePill.rotation.z -= 0.01875
        }
      } else if (this.choice && this.redPill.position.z < 5) {
        this.bluePill.material.opacity -= 0.015
        this.redPill.position.z += 0.0625

        if (this.redPill.position.x < 0) {
          this.redPill.position.x += 0.0625
        }

        if (this.redPill.rotation.y > 0.8) {
          this.redPill.rotation.y -= 0.0125
        }

        if (this.redPill.rotation.z < 1.5) {
          this.redPill.rotation.z += 0.025
        }
      } else {
        setTimeout(() => {
          Loading.checkActiveItem()
          // this.$ua.trackEvent('PillChoice', 'Chosen', 'Pill', this.choice ? 'Red' : 'Blue')
          this.$router.push({ name: this.choice ? 'RabbitHole' : 'Console' })
        }, 8500)

        cancelAnimationFrame(this.choiceAnimation)
        this.goToMenu = true

        setTimeout(() => {
          if (this.choice) Sounds.stopMusic()

          this.raining = false
          this.fadeOut = true
        }, 3500)
      }
    },

    createSpeech () {
      Sounds.playSpeach()
    },

    loadPill (color) {
      const jsonLoader = new JSONLoader()
      const pillMaterial = {
        shading: SmoothShading,
        emissiveIntensity: 1,
        emissive: 0x000000,
        color: color,

        transparent: true,
        depthWrite: true,
        depthTest: true,

        roughness: 0.2,
        metalness: 0,
        opacity: 0
      }

      jsonLoader.load('/static/models/pill.json', (geometry) => {
        const pill = new Mesh(geometry, new MeshStandardMaterial(pillMaterial))
        const wait = Loading.getActiveItem() === false ? 0 : 1200

        if (color === 0x003FFF) {
          pill.rotation.set(0, -1.5, -0.4)
          pill.position.set(2.5, 0, 2)
          this.bluePill = pill

          setTimeout(() => {
            this.showBlue = true
          }, 1600 + wait)
        } else {
          pill.rotation.set(-0.05, 1.3, 0.4)
          pill.position.set(-2.5, 0.2, 2)
          this.redPill = pill

          setTimeout(() => {
            this.showRed = true
            setTimeout(this.createChoice.bind(this), 8500)
          }, 8100 + wait)
        }

        pill.scale.set(0.2, 0.2, 0.2)
        this.scene.add(pill)
      })
    },

    createChoice () {
      this.choice = false
      this.showRed = false
      this.showBlue = false

      setTimeout(() => {
        this.raining = true
        this.visiblePills = true
      }, 1500)

      this._onKeyDown = this.onKeyDown.bind(this)
      document.addEventListener('keydown', this._onKeyDown, false)
    },

    onKeyDown (event) {
      const code = event.keyCode

      if (code === 37 || code === 39) {
        this.choice = !this.choice
        this.animate()
      } else if (code === 13) {
        document.removeEventListener('keydown', this._onKeyDown, false)
        this.animateChosenPill()
      }
    },

    onResize () {
      this.height = window.innerHeight
      this.width = window.innerWidth

      this.renderer.setSize(this.width, this.height)
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
    }
  },

  mounted () {
    if (!Platform.prerenderer) {
      this.createScene()
      this.createCamera()
      this.createLights()
      this.createSpeech()

      this.loadPill(0x003FFF)
      this.loadPill(0xB40000)

      this._onResize = this.onResize.bind(this)
      window.addEventListener('resize', this._onResize, false)

      this.createRenderer()
      this.animate()
    }
  },

  beforeDestroy () {
    Sounds.endSpeach(!this.choice)
    window.removeEventListener('resize', this._onResize, false)
    document.removeEventListener('keydown', this._onKeyDown, false)
  },

  metaInfo: {
    title: 'Pills'
  }
}
</script>

<style scoped lang="scss">
.pill-choice-page {
  position: absolute;
  overflow: hidden;
  margin: auto;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}
</style>
