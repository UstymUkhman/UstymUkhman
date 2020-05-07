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
@import 'mixins';

.screen-overlay {
  background-image: url('../assets/img/overlay.png');
  background-position: top left;
  background-repeat: repeat;

  @include center-size;
  z-index: $screen;

  @include breakpoint($sm-down) {
    pointer-events: none;
  }
}
</style>
