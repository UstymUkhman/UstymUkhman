<template>
  <img src="../assets/img/element.jpg">
</template>

<script>
export default {
  name: 'AnimatedElement'
}
</script>

<style scoped lang="scss">
@import 'app-colors';

img {
  border: solid 3px $white;
  border-radius: 50%;

  position: relative;
  height: 150px;
  width: 150px;
}
</style>
