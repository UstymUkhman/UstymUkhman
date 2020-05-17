<template>
  <div itemtype="http://schema.org/WebPageElement" class="experiment-list" itemscope>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperimentList' // ,

  // setup () {
  // }
})
</script>

<style lang="scss" scoped>
.experiment-list {
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
