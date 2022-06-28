<template>
  <article itemtype="http://schema.org/WebPage" class="more-page" itemscope>
    <canvas ref="pills"></canvas>
  </article>
</template>

<script lang="ts">
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import { Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { DirectionalLight } from 'three/src/lights/DirectionalLight'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import { BufferGeometry } from 'three/src/core/BufferGeometry'
import { AmbientLight } from 'three/src/lights/AmbientLight'
type JSONModel = import('@/utils/3D/JSONLoader').JSONModel
import { Loading, Speech, firePrerender } from '@/utils'

import { SpotLight } from 'three/src/lights/SpotLight'
import AssetsLoader from '@/utils/3D/AssetsLoader'
import { Viewport, Size } from '@/utils/Viewport'
import anime, { AnimeInstance } from 'animejs'

import { Scene } from 'three/src/scenes/Scene'
import { Mesh } from 'three/src/objects/Mesh'
import PILL from '@/assets/models/pill.json'
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

    function createBluePill (geometry: BufferGeometry): void {
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

    function createRedPill (geometry: BufferGeometry): void {
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
        const key = event.key

        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          setChosenPill()
        } else if (key === 'Enter') {
          animateChosenPill()
        }
      }

      else {
        clearTimeout(choiceTimeout)
        blueFade.pause()
        redFade.pause()
        createChoice()
        Speech.stop()
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

    const loader: AssetsLoader = new AssetsLoader()
    loader.loadModel(PILL as JSON, createPills)

    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    const camera = new PerspectiveCamera(75, screen.size.ratio, 1, 10)
    camera.position.z = 7.5

    let renderer: WebGLRenderer
    const scene = new Scene()
    const pills = ref()

    let blueFade: AnimeInstance
    let redFade: AnimeInstance
    let bluePill: Mesh
    let redPill: Mesh

    let choiceTimeout: number
    let interactable = false
    let choice = true
    let frame: number

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown, false)
      firePrerender({ title: 'More' })
      createRenderer()
      createLights()
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
