<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <ScreenAnimation v-if="visibleAnimation && !isPrerenderer" />

    <transition appear name="matrix-rain">
      <MatrixRain v-if="matrixRain" :ratio="rainRatio" :mobile="isMobile" />
    </transition>

    <router-view
      @toggle-overlay="visibleOverlay = $event"
      @toggle-rain="visibleRain = $event"
      v-show="!visibleAnimation"
      class="page"
    />

    <ScreenOverlay v-if="visibleOverlay && !isPrerenderer" />
  </article>
</template>

<script lang="ts">
import { ComputedRef, Ref, defineComponent, reactive, computed, onMounted, ref } from 'vue'
import ScreenAnimation from '@components/ScreenAnimation.vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import MatrixRain from '@components/MatrixRain.vue'
import { useRoute } from 'vue-router'
import { Platform } from '@/utils'

interface TemplateValues {
  readonly matrixRain: ComputedRef<boolean>
  readonly rainRatio: ComputedRef<number>
  readonly visibleAnimation: Ref<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly visibleRain: Ref<boolean>
  readonly isPrerenderer: boolean
  readonly isMobile: boolean
}

export default defineComponent({
  name: 'Home',

  components: {
    ScreenAnimation,
    ScreenOverlay,
    MatrixRain
  },

  setup (): TemplateValues {
    const isPrerenderer = Platform.prerenderer
    const route = reactive(useRoute())
    const isMobile = Platform.mobile

    const visibleAnimation = ref(false)
    const visibleOverlay = ref(true)
    const visibleRain = ref(false)

    const rainRatio = computed(() =>
      route.name === 'Works' || route.name === 'Contacts' ? 0.5 : 1
    )

    const matrixRain = computed(() =>
      route.name !== 'RabbitHole'
    )

    onMounted(() => {
      if (route.name !== 'About' && route.name !== 'More') {
        setTimeout(() => { visibleRain.value = true }, 500)
      }
    })

    return {
      visibleAnimation,
      visibleOverlay,
      isPrerenderer,
      visibleRain,
      matrixRain,
      rainRatio,
      isMobile
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
