<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="web-doom-page">
    <iframe ref="game" src="/static/doom/web-doom.html" :class="{'loaded': progress === 100}"></iframe>

    <transition appear>
      <div v-if="progress < 100" class="loading-container">
        <span class="loading-text">Loading...</span>
        <span class="progress">{{ progress }}%</span>
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
      loading: null,
      progress: 0
    }
  },

  methods: {
    completeLoading () {
      window.doomLoadingProgress = undefined
      delete window.doomLoadingProgress
      // To use when clicking on start
      // button to lock the pointer:
      this.$refs.game.focus()
      this.progress = 100
    }
  },

  mounted () {
    this.$emit('update:title', 'webDOOM')

    this.loading = setInterval(() => {
      const progress = window.doomLoadingProgress || this.progress

      if (progress === 100) {
        setTimeout(this.completeLoading.bind(this), 2500)
        clearInterval(this.loading)
      } else {
        this.progress = progress
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
    transition: opacity 1s 0.5s;
    position: absolute;
    overflow: hidden;

    height: 100%;
    width: 100%;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }
}

.loading-container {
  position: absolute;
  line-height: 50px;
  text-align: left;
  margin: auto;

  height: 50px;
  width: 425px;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  span {
    display: inline-block;
    font-size: 50px;

    &.progress {
      float: right;
    }
  }
}
</style>
