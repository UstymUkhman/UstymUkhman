<template>
  <article itemtype="http://schema.org/WebPage" class="hole-page" itemscope>
    <canvas ref="hole"></canvas>

    <div class="guidelines" itemprop="description">
      <p ref="message" class="text" :class="{'fullsize': !fullsize}">{{ guidelines }}</p>

      <transition appear>
        <div v-if="visibleDescription" class="description">
          <span>{{ description }}</span>
        </div>
      </transition>

      <div class="overlay" :class="{'fade': visibleOverlay}"></div>
    </div>
  </article>
</template>

<script lang="ts">
import { SetupContext, Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { FirstPersonControls, Direction } from '@/utils/3D/FirstPersonControls'
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'
import { Platform, Lettering, firePrerender } from '@/utils'
import { AmbientLight } from '@three/lights/AmbientLight'
import { Viewport /*, Size */ } from '@/utils/Viewport'
// import AssetsLoader from '@/utils/3D/AssetsLoader'
import { SpotLight } from '@three/lights/SpotLight'
// import { Raycaster } from '@three/core/Raycaster'
// import { Vector2 } from '@three/math/Vector2'
import { Scene } from '@three/scenes/Scene'
import router from '@/router'

// const PI_2 = Math.PI / 2
// const GREEN = 0x7CA294
const WHITE = 0xFFFFFF

interface TemplateValues {
  readonly message: Ref<HTMLParagraphElement>
  readonly visibleDescription: Ref<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly hole: Ref<HTMLCanvasElement>
  readonly description: string
  readonly guidelines: string
  readonly fullsize: boolean
}

export default defineComponent({
  name: 'RabbitHole',

  setup (props, context: SetupContext): TemplateValues {
    function isFullsize (): boolean {
      const { availWidth, availHeight } = window.screen
      const { outerWidth, outerHeight } = window

      const fullHeight = outerHeight === availHeight
      const fullWidth = outerWidth === availWidth

      return fullWidth && fullHeight
    }

    // function onResize (size: Size): void {}

    function onBlur (): void {
      controls.setFullscreenMode(false)
      exitFullscreenMode()
    }

    function onMouseDown (event: MouseEvent): void {
      if (event.which !== 1) return
      // pressed = controls.isFullscreen
    }

    function onMouseUp (): void {
      // pressed = false
    }

    function onKeyDown (event: KeyboardEvent): void {
      const ready = isFullsize && event.keyCode === 13
      const inFullscreen = controls.isFullscreen

      console.log(ready, inFullscreen)
    }

    /* function addEventListeners (): void {
      document.addEventListener('mousedown', onMouseDown, false)
      document.addEventListener('mouseup', onMouseUp, false)
      document.addEventListener('keydown', onKeyDown, false)
      window.addEventListener('blur', onBlur, false)

      controls.exitFullscreenCallback(() => {
        controls.enable(false)
        exitFullscreenMode()
      })
    } */

    function removeEventListeners (): void {
      document.removeEventListener('mousedown', onMouseDown, false)
      document.removeEventListener('mouseup', onMouseUp, false)
      document.removeEventListener('keydown', onKeyDown, false)
      window.removeEventListener('blur', onBlur, false)
    }

    /* function enterFullscreenMode (): void {
      document.addEventListener('mousedown', onMouseDown, false)
      document.addEventListener('mouseup', onMouseUp, false)

      // forceSuggestion = false
      // ready = true
    } */

    function exitFullscreenMode (): void {
      document.removeEventListener('mousedown', onMouseDown, false)
      document.removeEventListener('mouseup', onMouseUp, false)

      // forceSuggestion = true
      // ready = false
    }

    function createCamera (): void {
      camera = new PerspectiveCamera(4, screen.size.ratio, 1, 100)
      camera.rotation.x = -Math.PI / 4.075
      camera.position.z = -0.25
      scene.add(camera)
    }

    function createLights (): void {
      const ambientLight = new AmbientLight(WHITE, 0.25)
      const firstLight = new SpotLight(WHITE, 0.8)

      firstLight.target.position.set(0, 0, center)
      firstLight.target.updateMatrixWorld()
      firstLight.position.set(0, 300, -75)
      firstLight.distance = 750

      const secondLight = firstLight.clone()
      secondLight.position.z = 525

      scene.add(ambientLight)
      scene.add(secondLight)
      scene.add(firstLight)
    }

    function createRenderer (): void {
      renderer = new WebGLRenderer({ canvas: hole.value })
      renderer.setSize(screen.size.width, screen.size.height)
      renderer.setPixelRatio(window.devicePixelRatio || 1)
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.focus()
    }

    function createControls (): void {
      controls = new FirstPersonControls(hole.value, scene, camera)

      controls.error
        ? (dispose(), router.push({ name: 'Home' }))
        : controls.setBorders({
          [Direction.DOWN]: center + 242,
          [Direction.UP]: center - 230,
          [Direction.RIGHT]: 18,
          [Direction.LEFT]: -18
        })
    }

    function dispose (): void {
      controls.dispose()
      renderer.dispose()
      screen.dispose()
    }

    const message: Ref<HTMLParagraphElement> = ref()!
    const hole: Ref<HTMLCanvasElement> = ref()!
    const visibleDescription = ref(false)
    const visibleOverlay = ref(false)

    const screen = new Viewport((/* size: Size */) => {
      // onResize(size)
    })

    // const raycaster = new Raycaster()
    const fullsize = isFullsize()
    // const focus = new Vector2()
    const scene = new Scene()

    let controls: FirstPersonControls
    let camera: PerspectiveCamera
    let renderer: WebGLRenderer
    let lettering: Lettering

    // let pressed = false
    const center = 225
    let frame: number

    const guidelines = `
      Welcome to the real world.          ###
      Use W, A, S, D keys to move and drag you mouse to look around.##
      Press left mouse button to interact with the enviroment.#####

      ${fullsize ? '' : `
        It seems that your browser window is not full size.##
        Please, be sure to maximize it in order to fully enjoy this experience.#####
      `}

      Press  ENTER  when you're ready.
    `

    const description = 'Press ENTER to interact'

    onMounted(() => {
      firePrerender({ title: 'Rabbit Hole', fullTitle: true })
      lettering = new Lettering(message.value, 50, 0)
      context.emit('toggle-overlay', false)

      if (!Platform.prerenderer) {
        createCamera()
        createLights()

        createRenderer()
        createControls()

        lettering.animate()
      }
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      removeEventListeners()
      dispose()
    })

    return {
      visibleDescription,
      visibleOverlay,
      description,
      guidelines,
      fullsize,
      message,
      hole
    }
  }
})
</script>

<style lang="scss" scoped>
.hole-page {
  overflow: hidden;

  .guidelines {
    @include center-size;
    z-index: $screen;

    .text {
      @include center-size(920px, 154px);

      text-align: center;
      visibility: hidden;

      &.fullsize {
        height: 252px;
      }
    }

    .description {
      transform: translateX(-50%);
      background-color: $black;

      border-radius: 5px;
      position: absolute;

      padding: 10px;
      bottom: 20px;
      left: 50%;
    }
  }

  .overlay {
    transition: background-color 1s;
    background-color: transparent;

    @include center-size;
    pointer-events: none;

    &.fade {
      background-color: $white;
    }
  }
}
</style>
