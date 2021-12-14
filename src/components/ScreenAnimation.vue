<template>
  <canvas ref="circle" :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import { SetupContext, Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { Viewport, Size } from '@/utils/Viewport'
import { PI } from '@/utils/Number'
import { Color } from '@/utils'
import anime from 'animejs'

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
      canvasContext = circle.value.getContext('2d')!
      radius.value = Math.hypot(width, height) / 2

      anime({
        update: ({ animatables }) => draw(
          (animatables[0].target as unknown as typeof radius).value
        ),

        complete: () => context.emit('complete-animation'),

        easing: 'easeInOutQuad',
        targets: radius,
        duration: 1e3,
        value: 0.0
      });
    }

    const draw = (radius: number): void => {
      canvasContext.clearRect(0, 0, width, height)
      canvasContext.globalCompositeOperation = 'source-over'

      canvasContext.fillRect(0, 0, width, height)
      canvasContext.globalCompositeOperation = 'destination-out'

      canvasContext.beginPath()

      canvasContext.arc(halfWidth, halfHeight, radius, 0, PI.m2)
      canvasContext.fillStyle = `rgb(${Color.black})`
      canvasContext.fill()
    }

    let canvasContext: CanvasRenderingContext2D
    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    let halfHeight = height / 2
    let halfWidth = width / 2

    const circle = ref()
    const radius = {
      value: 0
    }

    onMounted(animate)
    onBeforeUnmount(() => screen.dispose())

    return { circle, width, height }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  z-index: $screen;
}
</style>
