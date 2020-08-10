<template>
  <article itemtype="http://schema.org/CreativeWork" class="experiment-page" itemscope>
    <iframe
      itemtype="https://schema.org/mainEntity" itemprop="mainEntity"
      :title="title" :name="title" :abstract="description"
      author="Ustym Ukhman" maintainer="Ustym Ukhman"
      :src="page" :url="github" allowfullscreen>
    </iframe>

    <Buttons :description="description" :repository="github" />
  </article>
</template>

<script lang="ts">
import Buttons from '@components/experiment/Buttons.vue'
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Experiment',

  components: {
    Buttons
  },

  props: {
    description: {
      required: true,
      type: String
    },

    github: {
      required: true,
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
