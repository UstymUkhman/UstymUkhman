<template>
  <div class="screen-overlay"></div>
</template>

<script>
export default {
  name: 'ScreenOverlay'
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'z-index';

.screen-overlay {
  background-image: url('../assets/img/overlay.png');
  background-position: top left;
  background-repeat: repeat;

  position: absolute;
  z-index: $screen;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($sm-down) {
    pointer-events: none;
  }
}
</style>
