<template>
  <article itemtype="http://schema.org/WebPage" class="experiments-page" itemscope>
    <ScreenOverlay v-if="!isPrerenderer" />

    <transition appear>
      <router-view class="page" />
    </transition>
  </article>
</template>

<script lang="ts">
import ScreenOverlay from '@components/ScreenOverlay.vue'
import { firePrerenderEvent, Platform } from '@/utils'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Experiments',

  components: {
    ScreenOverlay
  },

  setup () {
    const isPrerenderer = Platform.prerenderer
    onMounted(firePrerenderEvent)
    return { isPrerenderer }
  }
})
</script>

<style lang="scss" scoped>
.experiments-page {
  cursor: auto;

  .screen-overlay {
    background-color: rgba($black, 0.75);
  }

  .page {
    overflow: hidden;
    z-index: $screen;
  }
}
</style>
