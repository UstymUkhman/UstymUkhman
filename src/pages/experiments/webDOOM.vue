<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="web-doom-page">
    <iframe src="/static/doom/web-doom.html"></iframe>
    <!-- <div ref="container" class="container"> -->
    <!-- <div class="spinner" id="spinner"></div>
    <div class="emscripten" id="status">Downloading...</div>

    <span id="controls">
      <span><input type="checkbox" id="resize">Resize canvas</span>
      <span><input type="checkbox" id="pointerLock" checked>Lock/hide mouse pointer &nbsp;&nbsp;&nbsp;</span>
      <span><input type="button" value="Fullscreen" onclick="Module.requestFullscreen(document.getElementById('pointerLock').checked, document.getElementById('resize').checked)"></span>
    </span>

    <div class="emscripten">
      <progress value="0" max="100" id="progress" hidden=1></progress>
    </div>

    <div class="emscripten_border">
      <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()"></canvas>
    </div> -->
    <!-- </div> -->
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
// import Viewport from '@/mixins/Viewport'

export default {
  name: 'webDOOM',

  mixins: [FirePrerenderEvent],
  // mixins: [Viewport, FirePrerenderEvent],

  // watch: {
  //   viewPort () {
  //     this.grading.onResize()
  //   }
  // },

  mounted () {
    this.$emit('update:title', 'webDOOM')
  },

  beforeDestroy () {
    this.jsCode.remove()
  },

  metaInfo: {
    title: 'webDOOM |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'webDOOM' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'webDOOM' },

      { vmid: 'description', name: 'description', content: 'Classic DOOM recompiled with WebAssembly.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'Classic DOOM recompiled with WebAssembly.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'Classic DOOM recompiled with WebAssembly.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/webDOOM.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/webDOOM.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
// @import 'variables';

.web-doom-page {
  position: absolute;
  overflow: hidden;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;
  left: 0;
  top: 0;
}
</style>
