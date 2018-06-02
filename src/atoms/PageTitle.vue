<template>
  <div class="title-container">
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
@import 'breakpoints';
@import 'app-colors';

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
    font-family: 'Kaushan Script';
    color: $dark-green;
    font-size: 35px;

    @include breakpoint($xs) {
      font-size: 25px;
    }
  }
}
</style>
