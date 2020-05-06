<template>
  <article itemtype="http://schema.org/WebPage" class="404-page" itemscope>
    <div class="numbers-container">
      <canvas ref="numbers"></canvas>
      <div v-if="mobile" class="mobile-overlay"></div>
    </div>

    <ScreenOverlay v-if="!prerenderer" />
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import { Platform, firePrerenderEvent } from '@/utils'

import { Viewport, Size } from '@/utils/Viewport'
import { green } from '@scss/variables.scss'
import { randomInt } from '@/utils/number'
/* eslint-enable no-unused-vars */

const MATRIX_FONT = 'normal 24px Martix Code NFI'

const COLUMN_OFFSET = 18
const COLUMN_HEIGHT = 14

const LEFT_OFFSET = 19.2
const LINE_HEIGHT = 25.6

interface TemplateValues {
  prerenderer: boolean
  mobile: boolean
  numbers: Ref
  block: Ref
}

export default defineComponent({
  name: '404',

  components: {
    ScreenOverlay
  },

  setup (): TemplateValues {
    const animate = (): void => {
      frame = requestAnimationFrame(animate)
      if (block.value) return

      context!.clearRect(0, 0, width, height)
      updateNumbers()

      for (let i = 0, c = 1, length = chars.length; i < length; i++, c++) {
        if (!(c % 10)) continue
        const columnLength = chars[i].length

        for (let j = 0, x = i * LEFT_OFFSET; j < columnLength; j++) {
          context!.fillText(chars[i][j], x, j * LINE_HEIGHT + 12)
        }
      }
    }

    const updateNumbers = (): void => {
      for (let i = 0, length = chars.length; i < length; i++) {
        const columnLength = chars[i].length

        for (let j = 0; j < columnLength; j++) {
          if (Math.random() < 0.25) {
            chars[i][j] = getCharCode()
          }
        }
      }
    }

    const fillColumns = (): void => {
      const columns = Math.ceil(width / COLUMN_OFFSET)
      chars = []

      for (let i = 0; i < columns; i++) {
        const length = Math.round(height / COLUMN_HEIGHT)
        const column = new Array(length)

        for (let j = 0; j < length; j++) {
          column[j] = getCharCode()
        }

        chars.push(column)
      }
    }

    const setCanvasStyle = (): void => {
      canvas!.height = height
      canvas!.width = width

      context!.shadowColor = `rgb(${green})`
      context!.fillStyle = `rgb(${green})`
      context!.textBaseline = 'middle'
      context!.font = MATRIX_FONT
      context!.shadowBlur = 5
    }

    const getCharCode = (): string => {
      const code = randomInt(48, 57)

      return (code === 64)
        ? String.fromCharCode(47)
        : String.fromCharCode(code)
    }

    const onResize = (): void => {
      height = screen.size.height
      width = screen.size.width

      setCanvasStyle()
      fillColumns()
    }

    const prerenderer: boolean = Platform.prerenderer
    let context: CanvasRenderingContext2D | null
    const mobile: boolean = Platform.mobile
    let canvas: HTMLCanvasElement | null

    const screen = new Viewport(onResize)
    let { width, height } = screen.size

    const numbers = ref(null)
    const block = ref(false)

    let frame: number = 0
    let chars: string[][]

    onMounted(() => {
      canvas = numbers.value
      context = canvas!.getContext('2d')

      fillColumns()
      setCanvasStyle()
      firePrerenderEvent()
      requestAnimationFrame(animate)
      setTimeout(() => { block.value = true }, 3000)
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      screen.dispose()
    })

    return {
      prerenderer,
      numbers,
      mobile,
      block
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

// System Failure easing:
// $ease-in-quart

.numbers-container {
  @include absolute-size;

  canvas {
    @include absolute-size;
    z-index: 0;
  }

  .mobile-overlay {
    background-color: rgba($black, 0.8);
    @include absolute-size;
  }
}

// .matrix-rain-leave-active {
//   transition: opacity 3.5s;
// }

// .matrix-rain-leave-to {
//   opacity: 0;
// }
</style>
