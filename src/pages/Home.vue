<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <transition appear>
      <router-view @toggle:overlay="visibleOverlay = $event" class="page" />
    </transition>

    <transition appear name="overlay">
      <ScreenOverlay v-if="visibleOverlay && !platform.prerenderer" />
    </transition>
  </article>
</template>

<script>
import ScreenOverlay from '@/atoms/ScreenOverlay'
import Sounds from '@/utils/Sounds'
import Platform from '@/platform'

export default {
  name: 'Home',

  components: {
    ScreenOverlay
  },

  data () {
    return {
      visibleOverlay: true,
      platform: Platform
    }
  },

  mounted () {
    setTimeout(() => {
      const playMusic = this.$route.name !== 'Pills' && this.$route.name !== 'RabbitHole'

      if (!Platform.mobile && !Platform.prerenderer && playMusic) {
        Sounds.playMusic()
      }
    }, 500)
  },

  metaInfo: {
    title: ' '
  }
}
</script>

<style scoped lang="scss">
.overlay-enter-active {
  transition: opacity 0.1s 0.5s;
}

.overlay-leave-active {
  transition: opacity 0.1s;
}

.overlay-enter,
.overlay-leave-to {
  opacity: 0;
}
</style>
