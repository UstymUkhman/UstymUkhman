<template>
  <article itemtype="http://schema.org/CreativeWork" class="experiment-page" itemscope>
    <Header
      :scroll="title === 'Dynamic.css'"
      :description="description"
      :github="github"
      :title="title"
    />

    <iframe
      itemtype="https://schema.org/mainEntity" itemprop="mainEntity"
      :title="title" :name="title" :abstract="description"
      author="Ustym Ukhman" maintainer="Ustym Ukhman"
      :src="page" :url="github" allowfullscreen>
    </iframe>
  </article>
</template>

<script lang="ts">
import Header from '@components/experiments/Header.vue'
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Experiment',

  components: { Header },

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
