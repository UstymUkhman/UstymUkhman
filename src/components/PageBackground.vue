<template>
  <div class="page-background" :class="{'full-screen': full}">
    <div class="half-screen" :style="{'width': `${columns * 9}px`}"></div>
    <div class="half-screen" :style="{'width': `${columns * 9}px`}"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageBackground',

  props: {
    columns: {
      required: true,
      type: Number
    },

    full: {
      required: false,
      default: false,
      type: Boolean
    }
  }
})
</script>

<style lang="scss" scoped>
.page-background {
  @include absolute-size;
  pointer-events: none;

  .half-screen {
    transition: opacity 0.75s;
    background-color: $black;

    position: absolute;
    height: 100%;

    right: auto;
    left: 0;
    top: 0;

    &:last-child {
      opacity: 0;
      left: auto;
      right: 0;
    }
  }

  &.full-screen .half-screen {
    opacity: 0.8;
  }

  @include breakpoint($sm-down) {
    background-color: rgba($black, 0.8);

    .half-screen {
      display: none;
    }
  }
}
</style>
