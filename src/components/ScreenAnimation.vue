<template>
  <canvas ref="circle" :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import { SetupContext, Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { Viewport, Size } from '@/utils/Viewport'
import { PI } from '@/utils/Number'
import { Color } from '@/utils'

interface TemplateValues {
  readonly circle: Ref<HTMLCanvasElement>
  readonly height: number
  readonly width: number
}

export default defineComponent({
  name: 'ScreenAnimation',

  setup (props, context: SetupContext): TemplateValues {
    const onResize = (size: Size): void => {
      halfHeight = size.height / 2
      halfWidth = size.width / 2

      height = size.height
      width = size.width
    }

    const animate = (): void => {
      canvasContext.fillStyle = `rgb(${Color.black})`
      canvasContext.clearRect(0, 0, width, height)
      canvasContext.fillRect(0, 0, width, height)

      radius -= ((Date.now() - drawingTime) / 1000 * 75)
      if (radius <= 0) return context.emit('complete-animation')

      frame = requestAnimationFrame(animate)
      canvasContext.beginPath()

      canvasContext.arc(halfWidth, halfHeight, radius, 0, PI.m2)
      canvasContext.fillStyle = `rgb(${Color.white})`

      canvasContext.stroke()
      canvasContext.fill()
    }

    let canvasContext: CanvasRenderingContext2D
    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    let halfHeight = height / 2
    let halfWidth = width / 2

    const circle = ref()
    let drawingTime = 0

    let radius = 0
    let frame = 0

    onMounted(() => {
      canvasContext = circle.value.getContext('2d')!
      radius = (width > height ? halfWidth : halfHeight) * 1.2

      drawingTime = Date.now()
      animate()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      screen.dispose()
    })

    return { circle, width, height }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  z-index: $screen;
}
</style>
