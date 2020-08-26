<template>
  <div class="background-container" :class="{'fullscreen': fullscreen}">
    <div class="background" :style="{'width': `${columns * 12}px`}"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Background',

  props: {
    fullscreen: {
      type: Boolean,
      default: false,
      required: false
    },

    columns: {
      type: Number,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
$mobileBackground: rgba($black, 0.8);

.background-container {
  transition: background-color 500ms 500ms;
  background-color: rgba($black, 0);

  backface-visibility: hidden;
  @include absolute-size;
  pointer-events: none;

  left: 0;
  top: 0;

  .background {
    @include horizontal-gradient($black, transparent, 75%);
    backface-visibility: hidden;
    transition: opacity 500ms;

    position: absolute;
    height: 100%;

    right: auto;
    left: 0;
    top: 0;
  }

  &.fullscreen {
    background-color: rgba($black, 0.9);
    transition-delay: 0ms;

    @include breakpoint($sm-down) {
      background-color: $mobileBackground;
    }

    .background {
      transition-delay: 400ms;
      opacity: 0;
    }
  }

  @include breakpoint($sm-down) {
    background-color: $mobileBackground;
    transition: none;

    .background {
      display: none;
    }
  }
}
</style>
