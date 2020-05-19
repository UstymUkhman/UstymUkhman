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
import { firePrerender, Platform } from '@/utils'
import { defineComponent, onMounted } from 'vue'
// import objectFitImages from 'object-fit-images'

export default defineComponent({
  name: 'Experiments',

  components: {
    ScreenOverlay
  },

  props: {
    experiments: {
      required: true,
      type: Array
    }
  },

  setup ({ experiments }): { isPrerenderer: boolean } {
    const isPrerenderer = Platform.prerenderer

    console.log(experiments)

    onMounted(() => {
      // objectFitImages(Array<Ref>)
      firePrerender({ title: 'Experiments' })
    })

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

::-webkit-scrollbar {
  background-color: $black;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  transition: background-color 0.5s;
  background-color: $dark-green;
}

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: $green;
}
</style>
