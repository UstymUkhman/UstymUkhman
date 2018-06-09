<template>
  <div ref="rain" class="matrix-rain-container"></div>
</template>

<script>
import Platform from '@/platform'
import Rain from '@/utils/Rain'

export default {
  name: 'MatrixRain',

  props: {
    dense: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  mounted () {
    const rain = new Rain(Platform.phone ? 5 : 10)
    rain.createRain(this.$refs.rain, 'rain', this.dense)
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

div.matrix-rain-container {
  @include martix-code-nfi;

  transition: transform 5s ease-out;
  background-color: transparent;
  pointer-events: none;

  position: absolute;
  overflow: hidden;
  z-index: $rain;
  margin: auto;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}
</style>
