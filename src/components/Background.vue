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
      required: false,
      default: false,
      type: Boolean
    },

    columns: {
      required: true,
      type: Number
    }
  }
})
</script>

<style lang="scss" scoped>
.background-container {
  transition: background-color 500ms;
  background-color: rgba($black, 0);

  @include absolute-size;
  pointer-events: none;

  left: 0;
  top: 0;

  .background {
    @include horizontal-gradient($black, transparent, 75%, 100%);
    transition: opacity 500ms;

    position: absolute;
    height: 100%;

    right: auto;
    left: 0;
    top: 0;
  }

  &.fullscreen {
    background-color: rgba($black, 0.9);

    .background {
      transition-delay: 400ms;
      opacity: 0;
    }
  }

  @include breakpoint($sm-down) {
    background-color: rgba($black, 0.8);

    .background {
      display: none;
    }
  }
}
</style>
