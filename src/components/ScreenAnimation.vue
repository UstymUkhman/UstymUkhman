<template>
  <canvas ref="loader" :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import { Viewport, Size } from '@/utils'
import { PI } from '@/utils/Number'

export default defineComponent({
  name: 'ScreenAnimation',

  setup () {
    const onResize = (size: Size): void => {
      halfHeight = size.height / 2
      halfWidth = size.width / 2

      height = size.height
      width = size.width
    }

    const animate = (): void => {
      context.clearRect(0, 0, width, height)
      radius -= ((Date.now() - drawingTime) / 1000 * 75)

      if (radius > 0) {
        frame = requestAnimationFrame(animate)
        context.beginPath()

        context.arc(halfWidth, halfHeight, radius, 0, PI.m2)
        context.fillStyle = '#FFFFFF'

        context.stroke()
        context.fill()
      }
    }

    let context: CanvasRenderingContext2D
    const screen = new Viewport(onResize)

    let height = screen.size.height
    let width = screen.size.width

    let halfHeight = height / 2
    let halfWidth = width / 2

    let drawingTime: number = 0
    let radius: number = 0
    let frame: number = 0
    const loader = ref()

    onMounted(() => {
      context = loader.value.getContext('2d')
      radius = width > height ? halfWidth * 1.2 : halfHeight * 1.2

      drawingTime = Date.now()
      animate()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      screen.dispose()
    })

    return {
      loader,
      height,
      width
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

canvas {
  background-color: $black;
  @include absolute-size;

  overflow: hidden;
  z-index: 2;
}
</style>
