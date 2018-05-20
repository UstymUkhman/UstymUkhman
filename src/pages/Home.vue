<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="home-page">
    <transition appear>
      <router-view @show:overlay="checkHomeOverlay(true)" @hide:overlay="homeOverlay = false" class="page" />
    </transition>

    <ScreenOverlay v-if="(homeOverlay || pageOverlay) && !platform.prerenderer" />
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
      platform: Platform,
      homeOverlay: false
    }
  },

  computed: {
    pageOverlay () {
      const home = this.$route.name === 'Console'
      const hole = this.$route.name === 'RabbitHole'

      this.checkHomeOverlay()
      return !home && !hole
    }
  },

  methods: {
    checkHomeOverlay (visible = false) {
      this.homeOverlay = (this.$route.name === 'Console' && visible)

      if (this.homeOverlay) {
        this.$emit('set:background')
      }
    }
  },

  mounted () {
    setTimeout(() => {
      const playMusic = this.$route.name !== 'PillChoice' && this.$route.name !== 'RabbitHole'

      if (!Platform.mobile && !Platform.prerenderer && playMusic) {
        Sounds.playMusic()
      }
    }, 500)
  }
}
</script>
