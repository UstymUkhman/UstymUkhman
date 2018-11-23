<template>
  <div class="rain-container" :class="{'right': ratio > 1}" :style="{'width': `${100 / ratio}%`}">
    <canvas ref="code"></canvas>
    <div v-if="mobile" class="mobile-overlay"></div>
  </div>
</template>

<script>
import { white, green, lightGreen } from '@/_variables.scss'
import Viewport from '@/mixins/Viewport'

const MATRIX_FONT = 'normal 24px Martix Code NFI'
const LINE_HEIGHT = 27
const OFFSET = 18

export default {
  name: 'MatrixRain',

  mixins: [Viewport],

  props: {
    ratio: {
      default: 1,
      type: Number,
      required: false
    },

    mobile: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      height: window.innerHeight + 16,
      width: window.innerWidth + 16,
      lastUpdate: Date.now(),

      columns: null,
      context: null,
      canvas: null,
      frame: null,
      rows: null,

      duration: [],
      visible: [],
      index: [],
      chars: []
    }
  },

  watch: {
    ratio () {
      this.width = this.viewPort.width / this.ratio
      this.height = this.viewPort.height

      this.onResize()
    },

    viewPort () {
      this.width = this.viewPort.width / this.ratio
      this.height = this.viewPort.height

      this.onResize()
    }
  },

  methods: {
    getCharCode () {
      const code = Math.random() < 0.5 ? this.getRandomInt(33, 63) : this.getRandomInt(90, 126)
      return String.fromCharCode(code)
    },

    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    getCharAlpha (index, end) {
      return index > end ? 50 - (index - end) : 50
    },

    updateVisibleColumns () {
      if (this.visible.includes(false)) {
        const index = this.getRandomInt(0, this.columns)
        this.visible[index] = Math.random() < 0.5 || this.visible[index]
      }
    },

    onResize () {
      const _rows = this.rows
      const _columns = this.columns

      this.canvas.width = this.width
      this.canvas.height = this.height

      this.rows = Math.ceil(this.height / LINE_HEIGHT)
      this.columns = Math.ceil(this.width / OFFSET)
      this.context.font = MATRIX_FONT

      const rows = Math.max(this.rows - _rows, 0)
      const columns = Math.max(this.columns - _columns, 0)

      if (rows > 0 || columns > 0) {
        const _duration = Array.from(new Array(columns), d => this.getRandomInt(this.rows, 100))
        const _visible = Array.from(new Array(columns), v => false)
        const _index = Array.from(new Array(columns), i => 0)

        this.chars = []

        for (let i = 0; i < this.columns; i++) {
          const column = new Array(this.rows)

          for (let j = 0; j < this.rows; j++) {
            column[j] = this.getCharCode()
          }

          this.chars.push(column)
        }

        this.duration.push(..._duration)
        this.visible.push(..._visible)
        this.index.push(..._index)
      } else if (rows < 0 && columns < 0) {
        const columnsAbs = Math.abs(columns)
        const indexLength = this.index.length - columnsAbs
        const columnsLength = this.chars.length - columnsAbs
        const visibleLength = this.visible.length - columnsAbs
        const durationLength = this.duration.length - columnsAbs

        this.duration = this.duration.slice(0, durationLength)
        this.visible = this.visible.slice(0, visibleLength)
        this.chars = this.chars.slice(0, columnsLength)
        this.index = this.index.slice(0, indexLength)
      }
    },

    animate () {
      this.frame = requestAnimationFrame(this.animate.bind(this))
      const now = Date.now()

      if (now - this.lastUpdate < 50) {
        return
      }

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.updateVisibleColumns()
      this.lastUpdate = now

      for (let i = 0; i < this.chars.length; i++) {
        if (!this.visible[i]) {
          continue
        }

        for (let j = 0, i5 = this.index[i] - 5, i3 = this.index[i] - 3; j < this.chars[i].length; j++) {
          let alpha = this.getCharAlpha(this.index[i], this.duration[i])
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
            this.duration[i] = this.getRandomInt(this.rows, 100)
            this.index[i] = 0
          }

          const a = +(this.chars[i].length / (this.chars[i].length - j)).toFixed(1) / 100
          alpha = j < this.index[i] ? alpha * Math.min(a, 0.2) : 0

          this.context.fillStyle = `rgba(${color}, ${alpha})`
          this.context.fillText(this.chars[i][j], i * OFFSET, j * LINE_HEIGHT)

          if (Math.random() < update) {
            this.chars[i][j] = this.getCharCode()
          }
        }

        this.index[i]++
      }
    }
  },

  mounted () {
    this.canvas = this.$refs.code
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context = this.canvas.getContext('2d')

    this.columns = Math.ceil(this.width / OFFSET)
    this.rows = Math.ceil(this.height / LINE_HEIGHT)

    this.context.fillStyle = `rgba(${green}, 1.0)`
    this.context.shadowColor = `rgb(${green})`
    this.context.textBaseline = 'middle'
    this.context.font = MATRIX_FONT
    this.context.shadowBlur = 5

    this.duration = Array.from(new Array(this.columns), d => this.getRandomInt(this.rows, 100))
    this.visible = Array.from(new Array(this.columns), v => false)
    this.index = Array.from(new Array(this.columns), i => 0)

    for (let i = 0; i < this.columns; i++) {
      const column = Array.from(new Array(this.rows), c => this.getCharCode())
      this.chars.push(column)
    }

    this.animate()
  },

  beforeDestroy () {
    setTimeout(() => {
      cancelAnimationFrame(this.frame)
    }, 3500)
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

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
