<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <ExperimentHeader
      :scroll="title === 'Dynamic.css'"
      :description="description"
      :github="github"
      :title="title"
    />

    <iframe :title="title" :src="page" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import ExperimentHeader from '@components/ExperimentHeader.vue'
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

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

  setup (props): void {
    onMounted(() => {
      firePrerender({
        title: props.title,
        description: props.description,
        image: props.image
      })
    })
  }
})
</script>

<style lang="scss" scoped>
iframe {
  @include size;
  border: 0;
}
</style>
