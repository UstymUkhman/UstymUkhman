<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <ScreenAnimation v-if="visibleAnimation && !isPrerenderer" />

    <transition appear name="matrix-rain">
      <MatrixRain v-if="matrixRain" :ratio="rainRatio" :mobile="isMobile" />
    </transition>

    <router-view
      v-show="!visibleAnimation" class="page"
      @hide:overlay="visibleOverlay = false"
      @toggle:rain="visibleRain = $event"
    />

    <ScreenOverlay v-if="visibleOverlay && !isPrerenderer" />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import ScreenAnimation from '@/atoms/ScreenAnimation'
import ScreenOverlay from '@/atoms/ScreenOverlay'
import MatrixRain from '@/molecules/MatrixRain'
import Platform from '@/platform'

export default {
  name: 'Home',

  mixins: [FirePrerenderEvent],

  components: {
    ScreenAnimation,
    ScreenOverlay,
    MatrixRain
  },

  data () {
    return {
      isPrerenderer: Platform.prerenderer,
      isMobile: Platform.mobile,
      visibleAnimation: false,
      visibleOverlay: true,
      visibleRain: false
    }
  },

  watch: {
    $route (current, last) {
      this.visibleAnimation = last.name === 'RabbitHole'
      this.visibleRain = !this.visibleAnimation

      if (last.name === 'About' || this.visibleAnimation) {
        setTimeout(() => {
          this.visibleAnimation = false
        }, 1000)
      }
    }
  },

  computed: {
    matrixRain () {
      return Platform.mobile || (this.$route.name !== 'RabbitHole' && this.visibleRain)
    },

    rainRatio () {
      const fullPage = this.$route.name === 'About' || this.$route.name === 'Pills'
      const specialPages = fullPage || this.$route.path.includes('experiments')
      return Platform.mobile || specialPages ? 1 : 2.25
    }
  },

  mounted () {
    if (this.$route.name !== 'About' && this.$route.name !== 'Pills') {
      setTimeout(() => { this.visibleRain = true }, 500)
    }
  },

  metaInfo: {
    title: ' '
  }
}
</script>

<style scoped lang="scss">
.matrix-rain-leave-active {
  transition: opacity 3.5s;
}

.matrix-rain-leave-to {
  opacity: 0;
}
</style>
