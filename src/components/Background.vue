<template>
  <div class="background-container" :class="{'fullsize': fullsize}">
    <div class="background" :style="{'width': `${columns * 12}px`}">
      <div></div><div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Background',

  props: {
    fullsize: {
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
    backface-visibility: hidden;
    transition: opacity 500ms;

    position: absolute;
    height: 100%;

    right: auto;
    left: 0;
    top: 0;

    > div {
      display: inline-block;
      position: relative;
      height: 100%;

      &:first-child {
        background-color: $black;
        width: 75%;
      }

      &:last-child {
        background-image: url('../assets/images/gradient.png');
        background-position: top left;
        background-repeat: repeat-y;
        background-size: contain;
        width: 25%;
      }
    }
  }

  &.fullsize {
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
