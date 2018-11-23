<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="color-grading-page">
    <div ref="container" class="container"></div>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import ColorGrading from '@/3D/experiments/ColorGrading'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'ColorGrading',

  mixins: [Viewport, FirePrerenderEvent],

  watch: {
    viewPort () {
      this.grading.onResize()
    }
  },

  mounted () {
    this.grading = new ColorGrading()
    this.grading.startExperiment(this.$refs.container, 'lake')
  },

  beforeDestroy () {
    this.grading.destroy()
  },

  metaInfo: {
    title: 'ColorGrading |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'ColorGrading' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'ColorGrading' },

      { vmid: 'description', name: 'description', content: 'WebGL Color Grading.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'WebGL Color Grading.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'WebGL Color Grading.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/ColorGrading.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/ColorGrading.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.color-grading-page {
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
