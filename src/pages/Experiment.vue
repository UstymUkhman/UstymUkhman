<template>
  <article itemtype="http://schema.org/WebPage" class="experiment-page" itemscope>
    <iframe :src="page" allowfullscreen></iframe>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Experiment',

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

    name: {
      required: true,
      type: String
    },

    page: {
      required: true,
      type: String
    }
  },

  setup ({ name, image, page, description }): { page: string } {
    onMounted(() => {
      firePrerender({
        title: name,
        description,
        image
      })
    })

    return { page }
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
