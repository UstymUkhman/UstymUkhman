<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <iframe :src="preview" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import experiments from '@/assets/data/experiments.json'
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Experiment',

  setup () {
    const experiment = experiments[0]

    onMounted(() => {
      firePrerender({
        title: experiment.name,
        image: experiment.image,
        description: experiment.description
      })
    })

    return { preview: experiment.page }
  }
})
</script>

<style lang="scss" scoped>
iframe {
  height: 100%;
  width: 100%;
  border: 0;
}
</style>
