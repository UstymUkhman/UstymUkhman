<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="video-transition-page">
    <div id="canvas" class="webgl-canvas"></div>

    <div ref="plane" class="canvas-plane">
      <img src="../../3D/assets/noise.jpg" data-sampler="displacement" />

      <video src="/static/video/sky.mp4" data-sampler="firstTexture"></video>
      <video src="/static/video/lake.mp4" data-sampler="secondTexture"></video>
    </div>
  </article>
</template>

<script>
// import VideoTransition from '@/3D/experiments/VideoTransition'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'VideoTransition',

  mixins: [Viewport, FirePrerenderEvent],

  watch: {
    videoViewPort () {
      // this.transition.onResize(this.videoViewPort.width, this.videoViewPort.height)
    }
  },

  mounted () {
    // this.transition = new VideoTransition(this.$refs.plane)
    // this.$emit('update:title', 'VideoTransition')
    // this.$emit('obscure:background', true)
  },

  beforeDestroy () {
    // this.transition.destroy()
  },

  metaInfo: {
    title: 'VideoTransition |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'VideoTransition' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'VideoTransition' },

      { vmid: 'description', name: 'description', content: 'WebGL Video Transition.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'WebGL Video Transition.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'WebGL Video Transition.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/VideoTransition.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/VideoTransition.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
.video-transition-page {
  .webgl-canvas {
    pointer-events: none;
    position: absolute;

    height: 100%;
    width: 100%;

    left: 0;
    top: 0;
  }

  .canvas-plane {
    transform: translate(-50%, -50%);
    position: absolute;

    cursor: none;
    margin: auto;

    height: 100%;
    width: 100%;

    left: 50%;
    top: 50%;

    img,
    video {
      display: none;
    }
  }
}
</style>
