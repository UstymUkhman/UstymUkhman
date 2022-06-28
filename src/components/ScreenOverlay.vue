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
  background-image: url('../assets/images/overlay.png');
  background-position: top left;
  background-repeat: repeat;

  @include center-size;
  z-index: $screen;

  @include breakpoint($sm-down) {
    pointer-events: none;
  }
}
</style>
