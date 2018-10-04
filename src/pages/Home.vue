<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <ScreenAnimation v-if="visibleAnimation && !platform.prerenderer" @complete:animation="showMenu" />

    <transition appear>
      <MatrixRain v-if="matrixRain" :ratio="2.25" />
    </transition>

    <transition appear>
      <router-view
        v-show="!visibleAnimation" class="page"
        @hide:overlay="visibleOverlay = false"
      />
    </transition>

    <transition appear name="overlay">
      <ScreenOverlay v-if="visibleOverlay && !platform.prerenderer" />
    </transition>
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
      visibleAnimation: false,
      visibleOverlay: true,
      visibleRain: false,
      platform: Platform
    }
  },

  watch: {
    $route (current, last) {
      const restart = last.name === 'RabbitHole'
      this.visibleAnimation = restart
      this.visibleOverlay = !restart
    }
  },

  computed: {
    matrixRain () {
      return this.visibleRain &&
             this.$route.name !== 'About' &&
             this.$route.name !== 'Pills' &&
             this.$route.name !== 'RabbitHole'
    }
  },

  methods: {
    showMenu () {
      this.visibleAnimation = false
      this.visibleOverlay = true
    }
  },

  mounted () {
    setTimeout(() => { this.visibleRain = true }, 5000)
  },

  metaInfo: {
    title: ' '
  }
}
</script>

<style scoped lang="scss">
.overlay-enter-active {
  transition: opacity 0.1s 0.4s;
}

.overlay-leave-active {
  transition: opacity 0.1s;
}

.overlay-enter,
.overlay-leave-to {
  opacity: 0;
}
</style>
