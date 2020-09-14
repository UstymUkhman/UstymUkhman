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
      type: String,
      required: true
    },

    github: {
      type: String,
      required: true
    },

    route: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    video: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    page: {
      type: String,
      required: true
    }
  },

  setup (props): void {
    onMounted(() => firePrerender({
      title: props.title,
      description: props.description,
      image: props.image
    }))
  }
})
</script>

<style lang="scss" scoped>
iframe {
  @include size;
  border: 0;
}
</style>
