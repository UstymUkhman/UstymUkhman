<template>
  <article itemtype="http://schema.org/WebPage" class="hole-page" itemscope>
    <canvas ref="hole"></canvas>

    <div class="guidelines" itemprop="description">
      <p ref="message" class="text">{{ guidelines }}</p>

      <transition appear>
        <p v-if="visibleResizeMessage" class="text warning">
          It seems that your browser window is not full size.
          Please, be sure to maximize it in order to fully enjoy this experience.
        </p>
      </transition>

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
import { /* SetupContext, */ Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { /* Platform, */ Lettering, firePrerender } from '@/utils'
import { Viewport, Size } from '@/utils/Viewport'

interface TemplateValues {
  readonly message: Ref<HTMLParagraphElement>
  readonly visibleResizeMessage: Ref<boolean>
  readonly visibleDescription: Ref<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly hole: Ref<HTMLCanvasElement>
  readonly description: string
  readonly guidelines: string
}

export default defineComponent({
  name: 'RabbitHole',

  setup (/* props, context: SetupContext */): TemplateValues {
    function onResize (size: Size): void {
      fullsize = window.outerWidth >= (size.width - 20)
    }

    const message: Ref<HTMLParagraphElement> = ref()!
    const hole: Ref<HTMLCanvasElement> = ref()!
    const visibleResizeMessage = ref(false)
    const visibleDescription = ref(false)
    const visibleOverlay = ref(false)

    const guidelines = `
      Welcome to the real world.          ###
      Use W, A, S, D keys to move and drag you mouse to look around.##
      Press left mouse button to interact with the enviroment.#####
      Press  ENTER  when you're ready.
    `

    const description = 'Press ENTER to interact'

    const screen = new Viewport((size: Size) => {
      onResize(size)
      visibleResizeMessage.value = !fullsize
    })

    // context.emit('toggle-overlay', false)
    let lettering: Lettering
    let fullsize = false
    let frame: number

    onMounted(() => {
      firePrerender({ title: 'Rabbit Hole', fullTitle: true })
      lettering = new Lettering(message.value, 50, 0)
      // if (!Platform.prerenderer) {}
      lettering.animate()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      // removeEventListeners()
      // controls.dispose()
      // renderer.dispose()
      screen.dispose()
    })

    return {
      visibleResizeMessage,
      visibleDescription,
      visibleOverlay,
      description,
      guidelines,
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
      @include size(920px, 70px);
      visibility: hidden;
      position: relative;

      margin-left: 50px;
      margin-top: 75px;

      &.warning {
        visibility: visible;
        line-height: 28px;
        margin-top: 200px;
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
