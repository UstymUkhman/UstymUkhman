<template>
  <article itemtype="http://schema.org/WebPage" class="more-page" itemscope>
    <canvas ref="pills"></canvas>
  </article>
</template>

<script lang="ts">
import { MeshStandardMaterial } from '@three/materials/MeshStandardMaterial'
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { Platform, Loading, Sounds, firePrerender } from '@/utils'

import { DirectionalLight } from '@three/lights/DirectionalLight'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'
type JSONModel = import('@/utils/3D/JSONLoader').JSONModel
import { AmbientLight } from '@three/lights/AmbientLight'

import { SpotLight } from '@three/lights/SpotLight'
import AssetsLoader from '@/utils/3D/AssetsLoader'
import { Viewport, Size } from '@/utils/Viewport'
import { Geometry } from '@three/core/Geometry'
import anime, { AnimeInstance } from 'animejs'

import PILL from '@/assets/models/pill.json'
import { Scene } from '@three/scenes/Scene'
import { Mesh } from '@three/objects/Mesh'
import router from '@/router'

export default defineComponent({
  name: 'More',

  setup (): { readonly pills: Ref<HTMLCanvasElement> } {
    function createPills (model: JSONModel): void {
      createBluePill(model.geometry)
      createRedPill(model.geometry)

      createChoice(17200)
      render()
    }

    function createBluePill (geometry: Geometry): void {
      bluePill = new Mesh(geometry, new MeshStandardMaterial({
        color: 0x003FFF,
        ...material
      }))

      bluePill.rotation.set(0, -1.5, -0.4)
      bluePill.scale.set(0.25, 0.25, 0.25)
      bluePill.position.set(2.5, 0, 2)
      scene.add(bluePill)

      blueFade = anime({
        targets: bluePill.material,
        easing: 'linear',
        duration: 1000,
        opacity: 1.0,
        delay: 1700
      })
    }

    function createRedPill (geometry: Geometry): void {
      redPill = new Mesh(geometry, new MeshStandardMaterial({
        color: 0xB40000,
        ...material
      }))

      redPill.rotation.set(-0.05, 1.3, 0.4)
      redPill.scale.set(0.25, 0.25, 0.25)
      redPill.position.set(-2.5, 0.2, 2)
      scene.add(redPill)

      redFade = anime({
        targets: redPill.material,
        easing: 'linear',
        duration: 1000,
        opacity: 1.0,
        delay: 8700
      })
    }

    function createChoice (delay = 0): void {
      choiceTimeout = setTimeout(() => {
        interactable = true
        setChosenPill()
      }, delay)
    }

    function onKeyDown (event: KeyboardEvent): void {
      if (interactable) {
        const code = event.keyCode

        if (code === 37 || code === 39) {
          setChosenPill()
        } else if (code === 13) {
          animateChosenPill()
        }
      }

      else {
        clearTimeout(choiceTimeout)
        Sounds.endSpeach()
        blueFade.pause()
        redFade.pause()
        createChoice()
      }
    }

    function setChosenPill (): void {
      const scaleBlue = choice ? 0.35 : 0.15
      const scaleRed = choice ? 0.15 : 0.35
      choice = !choice

      anime({
        targets: redPill.scale,
        easing: 'easeInQuad',
        duration: 500,
        x: scaleRed,
        y: scaleRed,
        z: scaleRed
      })

      anime({
        targets: redPill.material,
        easing: 'linear',
        duration: 500,
        opacity: 1.0
      })

      anime({
        targets: bluePill.scale,
        easing: 'easeInQuad',
        duration: 500,
        x: scaleBlue,
        y: scaleBlue,
        z: scaleBlue
      })

      anime({
        targets: bluePill.material,
        easing: 'linear',
        duration: 500,
        opacity: 1.0
      })
    }

    function animateChosenPill (): void {
      document.removeEventListener('keydown', onKeyDown, false)

      if (choice) {
        anime({
          targets: redPill.position,
          complete: faceChosenPill,
          easing: 'easeOutQuad',
          duration: 800,
          x: 0,
          z: 5
        })

        anime({
          targets: redPill.rotation,
          easing: 'easeOutQuad',
          duration: 800,
          y: 0.7875,
          z: 1.525
        })

        anime({
          targets: redPill.material,
          easing: 'linear',
          duration: 2000,
          delay: 1000,
          opacity: 0
        })

        anime({
          targets: bluePill.material,
          easing: 'linear',
          duration: 500,
          opacity: 0
        })
      }

      else {
        anime({
          targets: bluePill.position,
          complete: faceChosenPill,
          easing: 'easeOutQuad',
          duration: 800,
          x: 0,
          z: 5
        })

        anime({
          targets: bluePill.rotation,
          easing: 'easeOutQuad',
          duration: 800,
          y: -1.5,
          z: -0.9
        })

        anime({
          targets: bluePill.material,
          easing: 'linear',
          duration: 2000,
          delay: 1000,
          opacity: 0
        })

        anime({
          targets: redPill.material,
          easing: 'linear',
          duration: 500,
          opacity: 0
        })
      }
    }

    function faceChosenPill (): void {
      setTimeout(() => {
        Loading.checkActiveItem()
        router.push({ name: choice ? 'RabbitHole' : 'Home' })
      }, 3000)
    }

    function onResize (size: Size): void {
      width = size.width
      height = size.height
      camera.aspect = size.ratio

      renderer.setSize(width, height)
      camera.updateProjectionMatrix()
    }

    function createLights (): void {
      const directional = new DirectionalLight(0xFFFFFF, 0.5)
      const spot = new SpotLight(0xFFFFFF, 1, 100, 1, 0, 1)
      const ambient = new AmbientLight(0x444444, 1)

      directional.position.set(25, 50, -50)
      spot.position.set(-25, 25, 5)

      scene.add(directional)
      scene.add(ambient)
      scene.add(spot)
    }

    function createRenderer (): void {
      renderer = new WebGLRenderer({
        canvas: pills.value,
        antialias: true,
        alpha: true
      })

      renderer.setSize(width, height)
    }

    function render (): void {
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    const material = {
      emissiveIntensity: 1,
      emissive: 0x000000,

      flatShading: true,
      transparent: true,
      depthWrite: true,
      depthTest: true,

      roughness: 0.2,
      metalness: 0,
      opacity: 0
    }

    const pills: Ref<HTMLCanvasElement> = ref()!
    const loader: AssetsLoader = new AssetsLoader()
    loader.loadJSON(PILL as JSON, createPills)

    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    const camera = new PerspectiveCamera(75, screen.size.ratio, 1, 10)
    let renderer: WebGLRenderer
    const scene = new Scene()
    camera.position.z = 7.5

    let blueFade: AnimeInstance
    let redFade: AnimeInstance
    let bluePill: Mesh
    let redPill: Mesh

    let choiceTimeout: number
    let interactable = false
    let choice = true
    let frame: number

    onMounted(() => {
      firePrerender({ title: 'More' })

      if (!Platform.prerenderer) {
        createLights()
        createRenderer()

        document.addEventListener('keydown', onKeyDown, false)
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown, false)
      cancelAnimationFrame(frame)
      renderer.dispose()
      screen.dispose()
    })

    return { pills }
  }
})
</script>

<style lang="scss" scoped>
.more-page {
  @include center-size;
  overflow: hidden;
}
</style>
