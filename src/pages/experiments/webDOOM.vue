<template>
  <article itemtype="http://schema.org/WebPageElement" itemscope class="web-doom-page">
    <iframe v-if="doom1" ref="doom1" src="/static/doom1/doom1.html" allowfullscreen></iframe>
    <iframe v-if="doom2" ref="doom2" src="/static/doom2/doom2.html" allowfullscreen></iframe>

    <transition appear>
      <div v-show="!doom1 && !doom2" class="preview-container">
        <div @click="doom1 = true" class="doom first"></div>
        <div @click="doom2 = true" class="doom second"></div>
      </div>
    </transition>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'

export default {
  name: 'webDOOM',

  mixins: [FirePrerenderEvent],

  data () {
    return {
      doom1: false,
      doom2: false
    }
  },

  mounted () {
    this.loading = setInterval(() => {
      if (window.doomReady) {
        if (this.doom1) this.$refs.doom1.focus()
        else this.$refs.doom2.focus()
        clearInterval(this.loading)
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

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/DOOM.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/DOOM.jpg` }
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

  .preview-container {
    position: absolute;
    overflow: hidden;

    height: 100%;
    width: 100%;

    .doom {
      background-size: 1920px 1080px;
      background-position: 50% 50%;

      position: absolute;
      overflow: hidden;
      cursor: pointer;

      height: 100%;
      width: 50%;

      &.first {
        background-image: url('/static/img/experiments/webDOOM.jpg');
        left: 0;
      }

      &.second {
        background-image: url('/static/img/experiments/webDOOM2.jpg');
        right: 0;
      }
    }
  }
}
</style>
