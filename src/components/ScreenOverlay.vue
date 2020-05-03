<template>
  <div class="screen-overlay"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ScreenOverlay'
})
</script>

<style lang="scss" scoped>
.screen-overlay {
  background-image: url('../assets/img/overlay.png');
  background-position: top left;
  background-repeat: repeat;

  position: absolute;
  z-index: $screen;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($sm-down) {
    pointer-events: none;
  }
}
</style>
