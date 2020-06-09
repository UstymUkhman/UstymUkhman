<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <ScreenAnimation v-if="visibleAnimation && !isPrerenderer" />

    <transition appear name="matrix-rain">
      <MatrixRain v-if="matrixRain && !isPrerenderer" @rain-columns="rainColumns = $event" />
    </transition>

    <PageBackground v-if="!isPrerenderer" :columns="rainColumns" :full="fullScreen" />

    <router-view
      @toggle-overlay="visibleOverlay = $event"
      v-show="!visibleAnimation"
      class="page"
    />

    <ScreenOverlay v-if="visibleOverlay && !isPrerenderer" />
  </article>
</template>

<script lang="ts">
import { ComputedRef, Ref, defineComponent, reactive, computed, ref } from 'vue'
import ScreenAnimation from '@components/ScreenAnimation.vue'
import PageBackground from '@components/PageBackground.vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import MatrixRain from '@components/MatrixRain.vue'
import { useRoute } from 'vue-router'
import { Platform } from '@/utils'

interface TemplateValues {
  readonly matrixRain: ComputedRef<boolean>
  readonly fullScreen: ComputedRef<boolean>
  readonly visibleAnimation: Ref<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly rainColumns: Ref<number>
  readonly isPrerenderer: boolean
}

export default defineComponent({
  name: 'Home',

  components: {
    ScreenAnimation,
    PageBackground,
    ScreenOverlay,
    MatrixRain
  },

  setup (): TemplateValues {
    const isPrerenderer = Platform.prerenderer
    const route = reactive(useRoute())

    const visibleAnimation = ref(false)
    const visibleOverlay = ref(true)
    const rainColumns = ref(0)

    const fullScreen = computed(() =>
      ['About', 'More', 'Experiments'].includes(route.name as string)
    )

    const matrixRain = computed(() =>
      route.name !== 'RabbitHole'
    )

    return {
      visibleAnimation,
      visibleOverlay,
      isPrerenderer,
      rainColumns,
      matrixRain,
      fullScreen
    }
  }
})
</script>

<style lang="scss" scoped>
.matrix-rain-leave-active {
  transition: opacity 3.5s;
}

.matrix-rain-leave-to {
  opacity: 0;
}
</style>
