<template>
  <div class="rain-container">
    <canvas ref="code"></canvas>
    <div v-if="mobile" class="mobile-overlay"></div>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { matrixFont, lightGreen, green, white } from '@scss/variables.scss'
import { randomInt, randomBool } from '@/utils/Number'
import { Viewport, Size } from '@/utils/Viewport'

const LINE_HEIGHT = 27
const OFFSET = 18

type Charset = {
  duration: Array<number>
  visible: Array<boolean>
  index: Array<number>
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

  setup (props): { code: Ref } {
    function getCharCode (): string {
      const code = randomBool() ? randomInt(33, 63) : randomInt(90, 126)
      return String.fromCharCode(code)
    }

    function getCharAlpha (index: number, end: number): number {
      return index > end ? 50 - (index - end) : 50
    }

    function updateVisibleColumns (): void {
      if (visible.includes(false)) {
        const int = randomInt(0, columns)
        visible[int] = int < getFirstColumn() ? visible[int] : randomBool() || visible[int]
      }
    }

    function getFirstColumn (): number {
      return visible.length - Math.floor(visible.length * props.ratio)
    }

    function updateCanvasSize (): void {
      canvas.width = width
      canvas.height = height

      columns = Math.ceil(width / OFFSET)
      rows = Math.ceil(height / LINE_HEIGHT)
    }

    function createCharset (): Charset {
      const duration: Array<number> = Array.from(new Array(columns), () => randomInt(rows, 100))
      const visible: Array<boolean> = Array.from(new Array(columns), () => false)
      const index: Array<number> = Array.from(new Array(columns), () => 0)

      chars = []

      for (let i = 0; i < columns; i++) {
        const column = Array.from(new Array(rows), () => getCharCode())
        chars.push(column)
      }

      return { duration, visible, index }
    }

    function onResize (size: Size): void {
      height = size.height + 16
      width = size.width + 16

      let _columns = columns
      let _rows = rows

      updateCanvasSize()

      _rows = Math.max(rows - _rows, 0)
      _columns = Math.max(columns - _columns, 0)

      context.fillStyle = `rgba(${green}, 1.0)`
      context.shadowColor = `rgb(${green})`
      context.textBaseline = 'middle'
      context.font = matrixFont
      context.shadowBlur = 5

      if (_rows > 0 || _columns > 0) {
        const charset = createCharset()

        duration.push(...charset.duration.slice(duration.length))
        visible.push(...charset.visible.slice(visible.length))
        index.push(...charset.index.slice(index.length))
      }

      else if (_rows < 0 || _columns < 0) {
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

    function animate (): void {
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
          }

          else if (j > i3) {
            color = white
            update = 0.25
          }

          if (alpha === 0) {
            duration[i] = i < getFirstColumn() ? -50 : randomInt(rows, 100)
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

    let chars: Array<Array<string>>
    let duration: Array<number>
    let visible: Array<boolean>
    let index: Array<number>

    let lastUpdate = Date.now()
    const code = ref()
    let columns = 0
    let frame = 0
    let rows = 0

    onMounted(() => {
      canvas = code.value
      updateCanvasSize()

      context = canvas.getContext('2d')!
      context.fillStyle = `rgba(${green}, 1.0)`
      context.shadowColor = `rgb(${green})`
      context.textBaseline = 'middle'
      context.font = matrixFont
      context.shadowBlur = 5

      const charset = createCharset()

      duration = charset.duration
      visible = charset.visible
      index = charset.index

      animate()
    })

    onBeforeUnmount(() => {
      screen.dispose()

      setTimeout(() => {
        cancelAnimationFrame(frame)
      }, 3500)
    })

    return { code }
  }
})
</script>

<style lang="scss" scoped>
.rain-container {
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
</style>
