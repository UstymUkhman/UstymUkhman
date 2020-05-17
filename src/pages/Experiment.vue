<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <iframe src="https://ustymukhman.github.io/Dynamic.css/public/" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Experiment' // ,

  // setup () {
  // }
})
</script>

<style lang="scss" scoped>
iframe {
  height: 100%;
  width: 100%;
  border: 0;
}
</style>
