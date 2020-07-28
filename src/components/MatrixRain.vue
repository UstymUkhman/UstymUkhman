<template>
  <div class="rain-container">
    <canvas ref="code"></canvas>
  </div>
</template>

<script lang="ts">
import { SetupContext, Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { randomInt, randomBool } from '@/utils/Number'
import { Platform, Color, matrixFont } from '@/utils'
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

  setup (props, context: SetupContext): { code: Ref } {
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
        visible[int] = randomBool() || visible[int]
      }
    }

    function updateCanvasSize (): void {
      canvas.width = width
      canvas.height = height

      columns = Math.ceil(width / OFFSET)
      context.emit('rain-columns', columns)
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

      canvasContext.fillStyle = `rgba(${Color.green}, 1.0)`
      canvasContext.shadowColor = `rgb(${Color.green})`
      canvasContext.textBaseline = 'middle'
      canvasContext.font = matrixFont
      canvasContext.shadowBlur = 5

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

    function animate (delta: number): void {
      frame = requestAnimationFrame(animate)
      if (delta - lastUpdate < 50) return

      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      updateVisibleColumns()
      lastUpdate = delta

      for (let i = 0; i < chars.length; i++) {
        if (!visible[i]) continue

        for (let j = 0, i5 = index[i] - 5, i3 = index[i] - 3; j < chars[i].length; j++) {
          let alpha = getCharAlpha(index[i], duration[i])
          let color = Color.green
          let update = 0.1

          if (j > i5 && j <= i3) {
            color = Color.lightGreen
            update = 0.25
          }

          else if (j > i3) {
            color = Color.white
            update = 0.25
          }

          if (alpha === 0) {
            duration[i] = randomInt(rows, 100)
            index[i] = 0
          }

          const a = +(chars[i].length / (chars[i].length - j)).toFixed(1) / 100
          alpha = j < index[i] ? alpha * Math.min(a, 0.2) : 0

          canvasContext.fillStyle = `rgba(${color}, ${alpha})`
          canvasContext.fillText(chars[i][j], i * OFFSET, j * LINE_HEIGHT)

          if (Math.random() < update) {
            chars[i][j] = getCharCode()
          }
        }

        index[i]++
      }
    }

    let canvasContext: CanvasRenderingContext2D
    const screen = new Viewport(onResize)
    let height = screen.size.height + 16
    let width = screen.size.width + 16
    let canvas: HTMLCanvasElement

    let chars: Array<Array<string>>
    let duration: Array<number>
    let visible: Array<boolean>
    let index: Array<number>

    let lastUpdate = 0
    const code = ref()
    let columns = 0
    let frame = 0
    let rows = 0

    onMounted(() => {
      canvas = code.value
      updateCanvasSize()

      canvasContext = canvas.getContext('2d', { alpha: false })!
      canvasContext.fillStyle = `rgba(${Color.green}, 1.0)`
      if (!Platform.firefox) canvasContext.shadowBlur = 5

      canvasContext.shadowColor = `rgb(${Color.green})`
      canvasContext.textBaseline = 'middle'
      canvasContext.font = matrixFont

      frame = requestAnimationFrame(animate)
      const charset = createCharset()

      duration = charset.duration
      visible = charset.visible
      index = charset.index
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
  left: 0;
  top: 0;

  canvas {
    @include absolute-size;
    z-index: 0;
  }
}
</style>
