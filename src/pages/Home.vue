<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <ScreenAnimation v-if="visibleAnimation && !isPrerenderer" @complete:animation="showMenu" />

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
      const restart = last.name === 'RabbitHole' && current.name === 'Home'
      this.visibleOverlay = !current.path.includes('experiments') && !restart
      this.visibleAnimation = restart
    }
  },

  computed: {
    matrixRain () {
      return Platform.mobile || (
        this.$route.name !== 'RabbitHole' &&
        this.$route.name !== 'About' &&
        this.visibleRain
      )
    },

    rainRatio () {
      const specialPages = this.$route.name === 'Pills' || this.$route.path.includes('experiments')
      return Platform.mobile || specialPages ? 1 : 2.25
    }
  },

  methods: {
    showMenu () {
      this.visibleAnimation = false
      this.visibleOverlay = true
    }
  },

  mounted () {
    if (this.$route.name !== 'Pills') {
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
