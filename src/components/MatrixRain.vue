<template>
  <div class="rain-container" :class="{'right': ratio > 1}" :style="{'width': `${100 / ratio}%`}">
    <canvas ref="code"></canvas>
    <div v-if="mobile" class="mobile-overlay"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { white, green, lightGreen } from '@scss/variables.scss'
import Viewport from '@/utils/Viewport'

const MATRIX_FONT = 'normal 24px Martix Code NFI'
const LINE_HEIGHT = 27
const OFFSET = 18

interface MatrixRainProps {
  mobile?: boolean,
  ratio: number
}

export default defineComponent({
  name: 'MatrixRain',

  setup (props: MatrixRainProps) {
    let context: CanvasRenderingContext2D | null
    let canvas: HTMLCanvasElement | null

    let height = window.innerHeight + 16
    let width = window.innerWidth + 16

    const screen = new Viewport()
    let lastUpdate = Date.now()
    const code = ref(null)

    let duration: number[] = []
    let visible: boolean[] = []
    let chars: string[][] = []
    let index: number[] = []

    let columns: number = 0
    let frame: number = 0
    let rows: number = 0

    const getCharCode = (): string => {
      const code = Math.random() < 0.5 ? getRandomInt(33, 63) : getRandomInt(90, 126)
      return String.fromCharCode(code)
    }

    const getCharAlpha = (index: number, end: number): number => {
      return index > end ? 50 - (index - end) : 50
    }

    const getRandomInt = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const updateVisibleColumns = (): void => {
      if (visible.includes(false)) {
        const int = getRandomInt(0, columns)
        visible[int] = Math.random() < 0.5 || visible[int]
      }
    }

    const onResize = (): void => {
      let _rows = rows
      let _columns = columns

      canvas!.width = width
      canvas!.height = height

      rows = Math.ceil(height / LINE_HEIGHT)
      columns = Math.ceil(width / OFFSET)
      context!.font = MATRIX_FONT

      _rows = Math.max(rows - _rows, 0)
      _columns = Math.max(columns - _columns, 0)

      if (_rows > 0 || _columns > 0) {
        const _duration = Array.from(new Array(_columns), d => getRandomInt(rows, 100))
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

      context!.clearRect(0, 0, canvas!.width, canvas!.height)
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
            duration[i] = getRandomInt(rows, 100)
            index[i] = 0
          }

          const a = +(chars[i].length / (chars[i].length - j)).toFixed(1) / 100
          alpha = j < index[i] ? alpha * Math.min(a, 0.2) : 0

          context!.fillStyle = `rgba(${color}, ${alpha})`
          context!.fillText(chars[i][j], i * OFFSET, j * LINE_HEIGHT)

          if (Math.random() < update) {
            chars[i][j] = getCharCode()
          }
        }

        index[i]++
      }
    }

    onMounted(() => {
      canvas = code.value
      canvas!.width = width
      canvas!.height = height

      rows = Math.ceil(height / LINE_HEIGHT)
      columns = Math.ceil(width / OFFSET)
      context = canvas!.getContext('2d')

      context!.fillStyle = `rgba(${green}, 1.0)`
      context!.shadowColor = `rgb(${green})`
      context!.textBaseline = 'middle'
      context!.font = MATRIX_FONT
      context!.shadowBlur = 5

      duration = Array.from(new Array(columns), d => getRandomInt(rows, 100))
      visible = Array.from(new Array(columns), v => false)
      index = Array.from(new Array(columns), i => 0)

      for (let i = 0; i < columns; i++) {
        const column = Array.from(new Array(rows), c => getCharCode())
        chars.push(column)
      }

      watchEffect(() => {
        width = screen.size.width / (props.ratio ?? 1)
        height = screen.size.height
        onResize()
      })

      animate()
    })

    onBeforeUnmount(() => {
      screen.dispose()

      setTimeout(() => {
        cancelAnimationFrame(frame)
      }, 3500)
    })

    return {
      mobile: props.mobile ?? false,
      ratio: props.ratio ?? 1,
      code
    }
  }
})
</script>

<style lang="scss" scoped>
.rain-container {
  position: absolute;
  height: 100%;

  &.right {
    left: auto;
    right: 0;
  }

  canvas {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
  }

  .mobile-overlay {
    background-color: rgba($black, 0.8);
    position: absolute;

    height: 100%;
    width: 100%;
  }
}
</style>
