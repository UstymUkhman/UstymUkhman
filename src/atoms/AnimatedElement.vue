<template>
  <img src="../assets/img/element.jpg">
</template>

<script>
export default {
  name: 'AnimatedElement'
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';

img {
  border: solid 1px $black;
  border-radius: 50%;

  position: relative;
  height: 150px;
  width: 150px;

  @include breakpoint($sm-down) {
    height: 100px;
    width: 100px;
  }
}
</style>
