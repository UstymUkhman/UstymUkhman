<template>
  <div class="rain-container" :class="{'right': ratio > 1}" :style="{'width': `${100 / ratio}%`}">
    <canvas ref="code"></canvas>
    <div v-if="mobile" class="mobile-overlay"></div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { matrixFont, lightGreen, green, white } from '@scss/variables.scss'

import { randomInt } from '@/utils/Number'
// eslint-disable-next-line no-unused-vars
import { Viewport, Size } from '@/utils'

const LINE_HEIGHT = 27
const OFFSET = 18

interface TemplateValues {
  readonly mobile: boolean
  readonly ratio: number
  readonly code: Ref
}

export default defineComponent({
  name: 'MatrixRain',

  props: {
    mobile: {
      required: false,
      default: false,
      type: Boolean
    },

    ratio: {
      required: false,
      type: Number,
      default: 1
    }
  },

  setup (props): TemplateValues {
    const getCharCode = (): string => {
      const code = Math.random() < 0.5 ? randomInt(33, 63) : randomInt(90, 126)
      return String.fromCharCode(code)
    }

    const getCharAlpha = (index: number, end: number): number => {
      return index > end ? 50 - (index - end) : 50
    }

    const updateVisibleColumns = (): void => {
      if (visible.includes(false)) {
        const int = randomInt(0, columns)
        visible[int] = Math.random() < 0.5 || visible[int]
      }
    }

    const onResize = (size: Size): void => {
      let _rows = rows
      let _columns = columns

      height = size.height
      width = size.width / props.ratio

      canvas.width = width
      canvas.height = height

      rows = Math.ceil(height / LINE_HEIGHT)
      columns = Math.ceil(width / OFFSET)
      context.font = matrixFont

      _rows = Math.max(rows - _rows, 0)
      _columns = Math.max(columns - _columns, 0)

      if (_rows > 0 || _columns > 0) {
        const _duration = Array.from(new Array(_columns), d => randomInt(rows, 100))
        const _visible = Array.from(new Array(_columns), v => false)
        const _index = Array.from(new Array(_columns), i => 0)

        chars = []

        for (let i = 0; i < columns; i++) {
          const column = new Array(rows)

          for (let j = 0; j < rows; j++) {
            column[j] = getCharCode()
          }

          chars.push(column)
        }

        duration.push(..._duration)
        visible.push(..._visible)
        index.push(..._index)
      } else if (_rows < 0 && _columns < 0) {
        const columnsAbs = Math.abs(_columns)
        const indexLength = index.length - columnsAbs
        const columnsLength = chars.length - columnsAbs
        const visibleLength = visible.length - columnsAbs
        const durationLength = duration.length - columnsAbs

        duration = duration.slice(0, durationLength)
        visible = visible.slice(0, visibleLength)
        chars = chars.slice(0, columnsLength)
        index = index.slice(0, indexLength)
      }
    }

    const animate = (): void => {
      frame = requestAnimationFrame(animate)

      const now = Date.now()
      if (now - lastUpdate < 50) return

      context.clearRect(0, 0, canvas.width, canvas.height)
      updateVisibleColumns()
      lastUpdate = now

      for (let i = 0; i < chars.length; i++) {
        if (!visible[i]) continue

        for (let j = 0, i5 = index[i] - 5, i3 = index[i] - 3; j < chars[i].length; j++) {
          let alpha = getCharAlpha(index[i], duration[i])
          let color = green
          let update = 0.1

          if (j > i5 && j <= i3) {
            color = lightGreen
            update = 0.25
          } else if (j > i3) {
            color = white
            update = 0.25
          }

          if (alpha === 0) {
            duration[i] = randomInt(rows, 100)
            index[i] = 0
          }

          const a = +(chars[i].length / (chars[i].length - j)).toFixed(1) / 100
          alpha = j < index[i] ? alpha * Math.min(a, 0.2) : 0

          context.fillStyle = `rgba(${color}, ${alpha})`
          context.fillText(chars[i][j], i * OFFSET, j * LINE_HEIGHT)

          if (Math.random() < update) {
            chars[i][j] = getCharCode()
          }
        }

        index[i]++
      }
    }

    let context: CanvasRenderingContext2D
    const screen = new Viewport(onResize)
    let height = screen.size.height + 16
    let width = screen.size.width + 16
    let canvas: HTMLCanvasElement

    let duration: number[] = []
    let visible: boolean[] = []
    let chars: string[][] = []
    let index: number[] = []

    let lastUpdate = Date.now()
    let columns: number = 0
    let frame: number = 0
    let rows: number = 0
    const code = ref()

    onMounted(() => {
      canvas = code.value
      canvas.width = width
      canvas.height = height

      rows = Math.ceil(height / LINE_HEIGHT)
      columns = Math.ceil(width / OFFSET)
      context = canvas.getContext('2d')!

      context.fillStyle = `rgba(${green}, 1.0)`
      context.shadowColor = `rgb(${green})`
      context.textBaseline = 'middle'
      context.font = matrixFont
      context.shadowBlur = 5

      duration = Array.from(new Array(columns), d => randomInt(rows, 100))
      visible = Array.from(new Array(columns), v => false)
      index = Array.from(new Array(columns), i => 0)

      for (let i = 0; i < columns; i++) {
        const column = Array.from(new Array(rows), c => getCharCode())
        chars.push(column)
      }

      animate()
    })

    onBeforeUnmount(() => {
      screen.dispose()

      setTimeout(() => {
        cancelAnimationFrame(frame)
      }, 3500)
    })

    return {
      mobile: props.mobile as boolean,
      ratio: props.ratio,
      code
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.rain-container {
  position: absolute;
  height: 100%;

  &.right {
    left: auto;
    right: 0;
  }

  canvas {
    @include absolute-size;
    z-index: 0;
  }

  .mobile-overlay {
    background-color: rgba($black, 0.8);
    @include absolute-size;
  }
}
</style>
