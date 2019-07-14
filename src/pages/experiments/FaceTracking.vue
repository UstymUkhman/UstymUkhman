<template>
  <article itemtype="http://schema.org/WebPageElement" itemscope class="face-tracking-page">
    <iframe name="Face Tracking" src="https://ustymukhman.github.io/face-tracking.github.io/" :width="viewPort.width" :height="viewPort.height" allow="camera *;" />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'FaceTracking',

  mixins: [Viewport, FirePrerenderEvent],

  metaInfo: {
    title: 'FaceTracking |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'Face Tracking' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'Face Tracking' },

      { vmid: 'description', name: 'description', content: 'clmtrackr Face Tracking.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'clmtrackr Face Tracking.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'clmtrackr Face Tracking.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/FaceTracking.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/FaceTracking.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.face-tracking-page {
  position: absolute;
  overflow: hidden;
  color: $white;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;
  left: 0;
  top: 0;

  iframe {
    position: absolute;
    overflow: hidden;

    height: 100%;
    width: 100%;

    padding: 0;
    margin: 0;
    left: 0;
    top: 0;
  }
}
</style>
