<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="pill-choice-page">
    <div ref="pills"></div>
  </article>
</template>

<script>
import { MeshStandardMaterial } from '@three/materials/MeshStandardMaterial'
import { JSONLoader } from '@three/loaders/JSONLoader'
import { Mesh } from '@three/objects/Mesh'

import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'
import { Scene } from '@three/scenes/Scene'

import { DirectionalLight } from '@three/lights/DirectionalLight'
import { AmbientLight } from '@three/lights/AmbientLight'
import { SpotLight } from '@three/lights/SpotLight'

import { SmoothShading } from '@three/constants.js'
import PILL from '@/3D/assets/models/pill.json'

import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import load from '@/3D/utils/assetsLoader'
import Viewport from '@/mixins/Viewport'
import Loading from '@/utils/Loading'

import Sounds from '@/utils/Sounds'
import Platform from '@/platform'
import to from 'await-to-js'
import anime from 'animejs'

export default {
  name: 'Pills',

  mixins: [Viewport, FirePrerenderEvent],

  data () {
    return {
      light: null,
      scene: null,
      camera: null,
      renderer: null,

      choice: true,
      redPill: null,
      bluePill: null,
      interactable: false,

      width: window.innerWidth,
      height: window.innerHeight
    }
  },

  watch: {
    viewPort () {
      this.width = this.viewPort.width
      this.height = this.viewPort.height

      this.renderer.setSize(this.width, this.height)
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
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

    async createPill (color) {
      const setPill = (model) => {
        const pill = new Mesh(model.geometry, new MeshStandardMaterial({
          flatShading: SmoothShading,
          emissiveIntensity: 1,
          emissive: 0x000000,
          color: color,

          transparent: true,
          depthWrite: true,
          depthTest: true,

          roughness: 0.2,
          metalness: 0,
          opacity: 0
        }))

        const wait = Loading.getActiveItem() === false ? 0 : 1200

        if (color === 0x003FFF) {
          pill.rotation.set(0, -1.5, -0.4)
          pill.position.set(2.5, 0, 2)
          this.bluePill = pill

          this.blueFade = anime({
            targets: this.bluePill.material,
            delay: 500 + wait,
            easing: 'linear',
            duration: 1000,
            opacity: 1.0
          })
        } else {
          pill.rotation.set(-0.05, 1.3, 0.4)
          pill.position.set(-2.5, 0.2, 2)

          this.redPill = pill
          this.render()

          this.redFade = anime({
            targets: this.redPill.material,
            delay: 7500 + wait,
            easing: 'linear',
            duration: 1000,
            opacity: 1.0
          })

          this.choiceTimeout = setTimeout(this.createChoice.bind(this), 16000 + wait)
        }

        pill.scale.set(0.25, 0.25, 0.25)
        this.scene.add(pill)
      }

      await to(load(new JSONLoader(), PILL, setPill))
    },

    createChoice () {
      this.setChosenPill()
      this.interactable = true
      setTimeout(() => { this.$emit('toggle:rain', true) }, 1000)
    },

    onKeyDown (event) {
      if (this.interactable) {
        const code = event.keyCode

        if (code === 37 || code === 39) {
          this.setChosenPill()
        } else if (code === 13) {
          this.animateChosenPill()
        }
      } else {
        Sounds.endSpeach()

        this.blueFade.pause()
        this.bluePill.material.opacity = 1

        this.redFade.pause()
        this.redPill.material.opacity = 1

        clearTimeout(this.choiceTimeout)
        this.createChoice()
      }
    },

    setChosenPill () {
      const scaleBlue = this.choice ? 0.35 : 0.15
      const scaleRed = this.choice ? 0.15 : 0.35

      this.choice = !this.choice

      anime({
        targets: this.redPill.scale,
        easing: 'easeInQuad',
        duration: 500,
        x: scaleRed,
        y: scaleRed,
        z: scaleRed
      })

      anime({
        targets: this.redPill.material,
        easing: 'linear',
        duration: 500,
        opacity: 1.0
      })

      anime({
        targets: this.bluePill.scale,
        easing: 'easeInQuad',
        duration: 500,
        x: scaleBlue,
        y: scaleBlue,
        z: scaleBlue
      })

      anime({
        targets: this.bluePill.material,
        easing: 'linear',
        duration: 500,
        opacity: 1.0
      })
    },

    animateChosenPill () {
      document.removeEventListener('keydown', this._onKeyDown, false)

      if (this.choice) {
        anime({
          complete: this.faceChosenPill.bind(this),
          targets: this.redPill.position,
          easing: 'easeOutQuad',
          duration: 800,
          x: 0,
          z: 5
        })

        anime({
          targets: this.redPill.rotation,
          easing: 'easeOutQuad',
          duration: 800,
          y: 0.7875,
          z: 1.525
        })

        anime({
          targets: this.redPill.material,
          easing: 'linear',
          duration: 2000,
          delay: 1000,
          opacity: 0
        })

        anime({
          targets: this.bluePill.material,
          easing: 'linear',
          duration: 500,
          opacity: 0
        })
      } else {
        anime({
          complete: this.faceChosenPill.bind(this),
          targets: this.bluePill.position,
          easing: 'easeOutQuad',
          duration: 800,
          x: 0,
          z: 5
        })

        anime({
          targets: this.bluePill.rotation,
          easing: 'easeOutQuad',
          duration: 800,
          y: -1.5,
          z: -0.9
        })

        anime({
          targets: this.bluePill.material,
          easing: 'linear',
          duration: 2000,
          delay: 1000,
          opacity: 0
        })

        anime({
          targets: this.redPill.material,
          easing: 'linear',
          duration: 500,
          opacity: 0
        })
      }
    },

    faceChosenPill () {
      this.$emit('toggle:rain', false)

      setTimeout(() => {
        Loading.checkActiveItem()
        this.$router.push({ name: this.choice ? 'RabbitHole' : 'SiteMenu' })
      }, 3000)
    },

    render () {
      this.renderer.render(this.scene, this.camera)
      this.raf = requestAnimationFrame(this.render.bind(this))
    }
  },

  mounted () {
    if (!Platform.prerenderer) {
      this.createScene()
      this.createCamera()
      this.createLights()
      this.createRenderer()

      this.createPill(0x003FFF)
      this.createPill(0xB40000)

      this._onKeyDown = this.onKeyDown.bind(this)
      document.addEventListener('keydown', this._onKeyDown, false)
    }
  },

  beforeDestroy () {
    cancelAnimationFrame(this.raf)
  },

  metaInfo: {
    title: 'Pills |'
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
