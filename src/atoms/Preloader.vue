<template>
  <canvas ref="preloader" :width="width" :height="height"></canvas>
</template>

<script>
export default {
  name: 'Preloader',

  data () {
    return {
      halfHeight: window.innerHeight / 2,
      halfWidth: window.innerWidth / 2,

      height: window.innerHeight,
      width: window.innerWidth,

      PI_2: Math.PI * 2
    }
  },

  methods: {
    animate () {
      this.context.clearRect(0, 0, this.width, this.height)
      this.radius -= ((Date.now() - this.drawingTime) / 1000 * 75)

      if (this.radius > 0) {
        this.drawCircle()
        requestAnimationFrame(this.animate.bind(this))
      } else {
        this.$emit('load:site')
      }
    },

    drawCircle () {
      this.context.beginPath()
      this.context.arc(this.halfWidth, this.halfHeight, this.radius, 0, this.PI_2)
      this.context.fillStyle = '#FFFFFF'

      this.context.stroke()
      this.context.fill()
    },

    onResize () {
      this.height = window.innerHeight
      this.width = window.innerWidth

      this.halfHeight = this.height / 2
      this.halfWidth = this.width / 2
    }
  },

  mounted () {
    this._onResize = this.onResize.bind(this)
    window.addEventListener('resize', this._onResize)

    this.radius = this.width > this.height ? this.halfWidth * 1.2 : this.halfHeight * 1.2
    this.context = this.$refs.preloader.getContext('2d')

    this.drawingTime = Date.now()
    requestAnimationFrame(this.animate.bind(this))
  },

  beforeDestroy () {
    window.removeEventListener('resize', this._onResize)
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';

canvas {
  background-color: $black;
  position: absolute;

  height: 100%;
  width: 100%;

  overflow: hidden;
  z-index: 2;
}
</style>
