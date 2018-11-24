<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="web-doom-page">
    <iframe ref="game" src="/static/doom/web-doom.html" allowfullscreen></iframe>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'

export default {
  name: 'webDOOM',

  mixins: [FirePrerenderEvent],

  mounted () {
    this.loading = setInterval(() => {
      if (window.doomReady) {
        clearInterval(this.loading)
        this.$refs.game.focus()
      }
    }, 100)
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
@import 'variables';

.web-doom-page {
  position: absolute;
  overflow: hidden;

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
  }
}
</style>
