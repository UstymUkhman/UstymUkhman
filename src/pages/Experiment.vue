<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <ExperimentHeader
      :scroll="title === 'Dynamic.css'"
      :description="description"
      :github="github"
      :title="title"
    />

    <iframe :src="page" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import ExperimentHeader from '@components/ExperimentHeader.vue'
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

interface TemplateValues {
  readonly title: string
  readonly description: string
  readonly github: string
  readonly page: string
}

export default defineComponent({
  name: 'Experiment',

  components: {
    ExperimentHeader
  },

  props: {
    description: {
      default: undefined,
      required: false,
      type: String
    },

    github: {
      default: undefined,
      required: false,
      type: String
    },

    route: {
      required: true,
      type: String
    },

    image: {
      required: true,
      type: String
    },

    video: {
      required: true,
      type: String
    },

    title: {
      required: true,
      type: String
    },

    page: {
      required: true,
      type: String
    }
  },

  setup ({ title, description, image, page, github }): TemplateValues {
    onMounted(() => { firePrerender({ title, description, image }) })

    return { title, description, github, page }
  }
})
</script>

<style lang="scss" scoped>
iframe {
  @include size;
  border: 0;
}
</style>
