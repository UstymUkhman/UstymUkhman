<template>
  <canvas ref="preloader" :width="width" :height="height"></canvas>
</template>

<script>
import Viewport from '@/mixins/Viewport'

const PI_2 = Math.PI * 2

export default {
  name: 'ScreenAnimation',

  mixins: [Viewport],

  data () {
    return {
      halfHeight: window.innerHeight / 2,
      halfWidth: window.innerWidth / 2,

      height: window.innerHeight,
      width: window.innerWidth
    }
  },

  watch: {
    viewPort () {
      this.height = this.viewPort.height
      this.width = this.viewPort.width

      this.halfHeight = this.height / 2
      this.halfWidth = this.width / 2
    }
  },

  methods: {
    animate () {
      this.context.clearRect(0, 0, this.width, this.height)
      this.radius -= ((Date.now() - this.drawingTime) / 1000 * 75)

      if (this.radius > 0) {
        this.drawCircle()
        this.raf = requestAnimationFrame(this.animate.bind(this))
      }
    },

    drawCircle () {
      this.context.beginPath()
      this.context.arc(this.halfWidth, this.halfHeight, this.radius, 0, PI_2)
      this.context.fillStyle = '#FFFFFF'
      this.context.stroke()
      this.context.fill()
    }
  },

  mounted () {
    this.radius = this.width > this.height ? this.halfWidth * 1.2 : this.halfHeight * 1.2
    this.context = this.$refs.preloader.getContext('2d')

    this.drawingTime = Date.now()
    this.animate()
  },

  beforeDestroy () {
    cancelAnimationFrame(this.raf)
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

canvas {
  background-color: $black;
  position: absolute;
  overflow: hidden;

  height: 100%;
  width: 100%;
  z-index: 2;
}
</style>
