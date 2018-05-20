<template>
  <transition appear name="slide-in">
    <aside class="version-info">v{{ version }}</aside>
  </transition>
</template>

<script>
export default {
  name: 'VersionInfo',
  props: {
    version: {
      type: String,
      required: true,
      default: 'untagged',
      validator: function (value) {
        return value.length > 0
      }
    },
    commitHash: {
      type: String,
      required: false,
      default: 'nohash',
      validator: function (value) {
        return value.length > 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';

.version-info {
  position: fixed;
  bottom: 0;
  right: 0;
  font-size: 9px;
  padding: 3px;
  background-color: $c-black;
  color: $c-white;
  z-index: 10000;

  @include breakpoint($xs) {
    // display: none;
    font-size: 6px;
  }
}

.slide-in-enter-active {
  transition: transform 0.5s;
}

.slide-in-enter {
  transform: translateX(100%);
}
</style>
