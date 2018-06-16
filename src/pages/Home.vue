<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <ScreenAnimation v-if="visibleAnimation && !platform.prerenderer" @complete:animation="showConsoleMenu" />

    <transition appear>
      <router-view
        v-show="!visibleAnimation"
        @hide:overlay="visibleOverlay = false"
        :skip="skipIntro" class="page"
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
import Platform from '@/platform'

export default {
  name: 'Home',

  mixins: [FirePrerenderEvent],

  components: {
    ScreenAnimation,
    ScreenOverlay
  },

  data () {
    return {
      visibleAnimation: false,
      visibleOverlay: true,
      platform: Platform,
      skipIntro: false
    }
  },

  watch: {
    $route (current, last) {
      const restart = last.name === 'RabbitHole'
      this.visibleAnimation = restart
      this.visibleOverlay = !restart
      this.skipIntro = restart
    }
  },

  methods: {
    showConsoleMenu () {
      this.visibleAnimation = false
      this.visibleOverlay = true
    }
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
