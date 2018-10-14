<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="video-glitch-page">
    <div ref="container" class="container"></div>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import VideoGlitch from '@/3D/experiments/VideoGlitch'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'VideoGlitch',

  mixins: [Viewport, FirePrerenderEvent],

  watch: {
    videoViewPort () {
      this.glitch.onResize(this.videoViewPort.width, this.videoViewPort.height)
    }
  },

  mounted () {
    this.glitch = new VideoGlitch()
    this.$emit('update:title', 'VideoGlitch')
    this.glitch.startExperiment(this.$refs.container, 'lake')
  },

  beforeDestroy () {
    this.glitch.destroy()
  },

  metaInfo: {
    title: 'VideoGlitch |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'VideoGlitch' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'VideoGlitch' },

      { vmid: 'description', name: 'description', content: 'Video Glitch Effects.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'Video Glitch Effects.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'Video Glitch Effects.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/VideoGlitch.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/VideoGlitch.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.video-glitch-page {
  position: absolute;
  overflow: hidden;
  color: $white;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;
  left: 0;
  top: 0;

  .container {
    transform: translate(-50%, -50%);

    pointer-events: none;
    position: absolute;

    margin: auto;
    padding: 0;

    left: 50%;
    top: 50%;
  }
}
</style>
