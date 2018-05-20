<template>
  <div :style="{'width': width + 'px', 'height': height + 'px'}" class="video-background-container">

    <youtube
      ref="player"
      video-id="5DUs-PSRU_0"
      :player-width="width"
      :player-height="height"
      :player-vars="settings"

      @ready="onReady"
      @ended="onEnd"
      class="youtube-player"
    />

    <div class="overlay"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'

export default {
  name: 'VideoBackground',

  data () {
    return {
      height: window.innerHeight,
      width: window.innerWidth,

      settings: {
        iv_load_policy: 3,
        modestbranding: 1,
        enablejsapi: 1,
        playsinline: 1,
        autoplay: 1,
        showinfo: 0,
        controls: 0,
        loop: 1,
        rel: 0
      }
    }
  },

  beforeCreate () {
    if (!/PhantomJS/.test(navigator.userAgent)) {
      Vue.use(VueYouTubeEmbed)
    }
  },

  methods: {
    onReady: function (player) {
      this.player = player
      this.onResize()
    },

    onEnd () {
      this.player.playVideo()
    },

    onResize () {
      this.width = window.innerWidth
      this.height = this.width / 16 * 9

      if (this.height < window.innerHeight) {
        this.height = window.innerHeight
        this.width = this.height / 9 * 16
      }
    }
  },

  mounted () {
    this.resized = this.onResize.bind(this)
    window.addEventListener('resize', this.resized)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resized)
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';

.video-background-container {
  transform: translate(-50%, -50%);

  position: fixed;
  margin: auto;

  left: 50%;
  top: 50%;

  .youtube-player {
    pointer-events: none;
    position: absolute;
    margin: auto;

    height: 100%;
    width: 100%;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }

  .overlay {
    background-color: rgba($black, 0.8);
    position: absolute;
    margin: auto;

    height: 100%;
    width: 100%;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }
}
</style>
