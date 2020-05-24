<template>
  <div itemtype="https://schema.org/title" itemprop="title" class="title-container">
    <h1 itemprop="headline" class="experiment-title">{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperimentTitle',

  props: {
    title: {
      required: true,
      type: String
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.title-container {
  padding-left: 25px;
  position: absolute;

  height: 100%;
  left: 0;

  @include breakpoint($xs) {
    padding-left: 10px;
  }

  .experiment-title {
    @include white-rabbit(30px);
    color: $dark-green;

    @include breakpoint($xs) {
      font-size: 20px;
    }
  }
}
</style>
