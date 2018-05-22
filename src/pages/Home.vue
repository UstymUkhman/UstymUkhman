<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <transition appear>
      <router-view @hide:overlay="visibleOverlay = false" class="page" />
    </transition>

    <ScreenOverlay v-if="visibleOverlay && !platform.prerenderer" />
  </article>
</template>

<script>
import ScreenOverlay from '@/atoms/ScreenOverlay'
import Sounds from '@/services/Sounds'
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
