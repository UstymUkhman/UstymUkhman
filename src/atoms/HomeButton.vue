<template>
  <div class="button-container">
    <div v-for="l in 3" :key="l" class="line"></div>
  </div>
</template>

<script>
export default {
  name: 'HomeButton'
}
</script>

<style scoped lang="scss">
@import 'variables';

.button-container {
  position: absolute;
  cursor: pointer;
  display: block;

  &:hover .line {
    background-color: $green;
  }

  .line {
    transition: background-color 0.5s;
    background-color: $dark-green;

    position: relative;
    height: 1px;
    width: 100%;

    &:nth-child(2) {
      margin: 4px 0;
    }
  }
}
</style>
