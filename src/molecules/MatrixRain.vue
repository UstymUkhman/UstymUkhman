<template>
  <div ref="rain" class="matrix-rain-container"></div>
</template>

<script>
import Platform from '@/platform'
import Rain from '@/utils/Rain'

export default {
  name: 'MatrixRain',

  mounted () {
    const rain = new Rain(Platform.phone ? 5 : 10)
    rain.createRain(this.$refs.rain, 'rain')
  }
}
</script>

<style scoped lang="scss">
@import 'z-index';
@import 'mixins';

div.matrix-rain-container {
  @include martix-code-nfi;
  @include rain-column;

  transition: transform 5s ease-out;
  background-color: transparent;

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
