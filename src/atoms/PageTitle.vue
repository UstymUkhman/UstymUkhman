<template>
  <div itemtype="https://schema.org/title" itemprop="title" class="title-container">
    <h1 itemprop="headline" class="page-title">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.title-container {
  padding-left: 25px;
  position: absolute;
  color: $silver;

  height: 100%;
  left: 0;

  @include breakpoint($xs) {
    padding-left: 10px;
  }

  .page-title {
    font-family: 'White Rabbit';
    color: $dark-green;
    font-size: 30px;

    @include breakpoint($xs) {
      font-size: 20px;
    }
  }
}
</style>
