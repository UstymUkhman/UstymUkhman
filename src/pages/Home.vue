<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <!-- <transition appear name="matrix-rain">
      <MatrixRain v-if="matrixRain" :ratio="rainRatio" :mobile="isMobile" />
    </transition> -->

    <MatrixRain />

    <ScreenOverlay v-if="visibleOverlay && !isPrerenderer" />
  </article>
</template>

<script lang="ts">
// import ScreenAnimation from '@components/ScreenAnimation.vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import { Platform, firePrerenderEvent } from '@/utils'
import MatrixRain from '@components/MatrixRain.vue'
import { defineComponent, onMounted } from 'vue'
// import { viewPort } from '@/utils/Viewport'

export default defineComponent({
  name: 'Home',

  components: {
    ScreenOverlay,
    MatrixRain
  },

  setup () {
    // const matrixRain = () => {
    //   return Platform.mobile || (this.$route.name !== 'RabbitHole' && this.visibleRain)
    // }

    // const rainRatio = () => {
    //   const fullPage = this.$route.name === 'About' || this.$route.name === 'Pills'
    //   const specialPages = fullPage || this.$route.path.includes('experiments')
    //   return Platform.mobile || specialPages ? 1 : 2.25
    // }

    const isPrerenderer = Platform.prerenderer
    const isMobile = Platform.mobile
    const visibleAnimation = false
    const visibleOverlay = true
    const visibleRain = false

    onMounted(() => {
      // if (this.$route.name !== 'About' && this.$route.name !== 'Pills') {
      //   setTimeout(() => { this.visibleRain = true }, 500)
      // }

      firePrerenderEvent()
    })

    return {
      visibleAnimation,
      visibleOverlay,
      isPrerenderer,
      visibleRain,
      // matrixRain,
      // rainRatio,
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
