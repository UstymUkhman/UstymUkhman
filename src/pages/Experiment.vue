<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <iframe :src="preview" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import experiments from '@/assets/data/experiments.json'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Experiment',

  setup () {
    const experiment = experiments[0]
    return { preview: experiment.page }
  }

  /* metaInfo: {
    title: `${experiment.name} |`,

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: `${experiment.name}` },
      { vmid: 'twittertitle', name: 'twitter:title', content: `${experiment.name}` },

      { vmid: 'description', name: 'description', content: `${experiment.description}` },
      { vmid: 'ogdescription', property: 'og:description', content: `${experiment.description}` },
      { vmid: 'twitterdescription', name: 'twitter:description', content: `${experiment.description}` },

      { vmid: 'ogurl', property: 'og:url', content: `${window.location.origin}/experiments/${experiment.route}` },
      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/${experiment.image}` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/${experiment.image}` }
    ]
  } */
})
</script>

<style lang="scss" scoped>
iframe {
  height: 100%;
  width: 100%;
  border: 0;
}
</style>
