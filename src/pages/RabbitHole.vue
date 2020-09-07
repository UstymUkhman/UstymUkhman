<template>
  <article itemtype="http://schema.org/WebPage" class="hole-page" itemscope>
    <canvas ref="hole"></canvas>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { /* Platform, */ firePrerender } from '@/utils'

export default defineComponent({
  name: 'RabbitHole',

  setup (): void {
    let frame: number

    onMounted(() => {
      firePrerender({ title: 'Rabbit Hole' })
      // if (!Platform.prerenderer) {}
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      // removeEventListeners()
      // controls.dispose()
      // renderer.dispose()
    })
  }
})
</script>

<style lang="scss" scoped>
.hole-page {
  overflow: hidden;

  .guidelines {
    @include white-rabbit;
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

    .suggestions {
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
