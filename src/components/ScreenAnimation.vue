<template>
  <canvas ref="loader" :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { Viewport, Size } from '@/utils/Viewport'
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

    const loader: Ref<HTMLCanvasElement> = ref()!
    let context: CanvasRenderingContext2D

    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    let halfHeight = height / 2
    let halfWidth = width / 2

    let drawingTime = 0
    let radius = 0
    let frame = 0

    onMounted(() => {
      context = loader.value.getContext('2d')!
      radius = (width > height ? halfWidth : halfHeight) * 1.2

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
canvas {
  background-color: $black;
  z-index: $screen;
}
</style>
