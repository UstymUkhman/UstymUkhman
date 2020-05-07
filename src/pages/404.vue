<template>
  <article itemtype="http://schema.org/WebPage" class="404-page" itemscope>
    <div class="numbers-container">
      <canvas ref="numbers"></canvas>

      <transition name="block">
        <div v-if="block" class="block-overlay"></div>
      </transition>

      <div v-if="mobile" class="mobile-overlay"></div>
    </div>

    <transition name="failure">
      <div v-if="block" class="system-failure">
        <span>System Failure</span>
      </div>
    </transition>

    <ScreenOverlay v-if="!prerenderer" />
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import { matrixFont, green } from '@scss/variables.scss'

import { Platform, firePrerenderEvent } from '@/utils'
import { Viewport, Size } from '@/utils/Viewport'
import { randomInt } from '@/utils/number'
/* eslint-enable no-unused-vars */

const COLUMN_OFFSET = 18
const COLUMN_HEIGHT = 14

const LEFT_OFFSET = 19.2
const LINE_HEIGHT = 25.6

interface TemplateValues {
  prerenderer: boolean
  block: Ref<boolean>
  numbers: Ref<null>
  mobile: boolean
}

export default defineComponent({
  name: '404',

  components: {
    ScreenOverlay
  },

  setup (): TemplateValues {
    const animate = (): void => {
      context!.clearRect(0, 0, width, height)
      updateNumbers()

      for (let i = 0, c = 1, length = chars.length; i < length; i++, c++) {
        if (skipColumns && !(c % 10)) continue
        const columnLength = chars[i].length

        for (let j = 0, x = i * LEFT_OFFSET; j < columnLength; j++) {
          context!.fillText(chars[i][j], x, j * LINE_HEIGHT + 12)
        }
      }

      frame = requestAnimationFrame(animate)
    }

    const updateNumbers = (): void => {
      for (let i = 0, length = chars.length; !block.value && i < length; i++) {
        const columnLength = chars[i].length

        for (let j = 0; j < columnLength; j++) {
          if (Math.random() < 0.25) {
            chars[i][j] = getCharCode()
          }
        }
      }
    }

    const fillColumns = (): void => {
      let columns = Math.ceil(width / COLUMN_OFFSET)

      if (block.value) {
        columns = Math.max(columns - chars.length, 0)
      } else {
        chars = []
      }

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
      context!.font = matrixFont
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

    let skipColumns: boolean = false
    const numbers: Ref = ref(null)
    const block: Ref = ref(false)

    let frame: number = 0
    let chars: string[][]

    onMounted(() => {
      canvas = numbers.value
      context = canvas!.getContext('2d')

      fillColumns()
      setCanvasStyle()
      firePrerenderEvent()

      frame = requestAnimationFrame(animate)
      setTimeout(() => { skipColumns = true }, 1500)
      setTimeout(() => { block.value = true }, 4500)
      setTimeout(() => { canvas!.style.opacity = '1' })
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

.numbers-container {
  @include absolute-size;

  canvas {
    transition: opacity 50ms 450ms;
    @include absolute-size;

    opacity: 0;
    z-index: 0;
  }

  .block-overlay {
    background-color: rgba($black, 0.5);
    @include absolute-size;
    opacity: 0;
  }

  .mobile-overlay {
    background-color: rgba($black, 0.8);
    @include absolute-size;
  }
}

.system-failure {
  border: solid 2px $energy-green;
  @include center-transform;

  padding: 5px 10px 3px;
  text-align: center;

  span {
    @include white-rabbit;
    text-shadow: $energy-green 0 0 10px;

    text-transform: uppercase;
    vertical-align: middle;
    text-align: center;
    color: $fade-green;

    position: relative;
    line-height: 26px;
    font-size: 24px;

    display: table;
    width: 100%;
    left: 0;
  }
}

.failure-enter-active {
  transition: opacity 100ms $ease-in-quart 750ms;
}

.failure-enter-from {
  opacity: 0;
}

.block-enter-active {
  transition: opacity 400ms 300ms;
}

.block-enter-to {
  opacity: 1 !important;
}
</style>