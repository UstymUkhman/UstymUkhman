<template>
  <div class="matrix-code-container">
    <div ref="rain" class="code-layout" :class="animation"></div>
  </div>
</template>

<script>
import Platform from '@/platform'
import Rain from '@/utils/Rain'

export default {
  name: 'MatrixCode',

  props: {
    run: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  watch: {
    run (val) {
      setTimeout(() => {
        this.$emit('run:code')
      }, 8500)
    }
  },

  computed: {
    animation () {
      return this.run ? 'run-animation' : 'setup-animation'
    }
  },

  mounted () {
    const mobile = Platform.tablet ? 33 : 20
    const rain = new Rain(Platform.mobile ? mobile : 100)
    rain.createRain(this.$refs.rain, 'code')
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.matrix-code-container {
  @include martix-code-nfi;
  @include code-column;

  background-color: transparent;
  position: absolute;
  margin: auto;

  display: block;
  z-index: $code;

  height: 110%;
  width: 110%;

  bottom: 0;
  left: -5%;
  right: 0;
  top: -5%;

  @include breakpoint($sm-down) {
    pointer-events: none;
  }

  .code-layout {
    transition: transform 8s linear;
    will-change: transform;
    visibility: hidden;

    height: 100%;
    width: 100%;

    &.setup-animation {
      transform: translateY(-3000px);
    }

    &.run-animation {
      transform: translateY(3000px);
      visibility: visible;
    }
  }
}
</style>
