<template>
  <article ref="container" itemscope itemtype="http://schema.org/WebPageElement" class="fbo-particles-page">
    <div ref="overlay" class="background-overlay" :class="{'fade': fadeOverlay}"></div>

    <div class="switch-container">
      <div @click="setParticlesExperiment" class="button" :class="{'active': !audioreactive}">Noise Particles</div>
      <div @click="setAudioreactiveExperiment" class="button" :class="{'active': audioreactive}">Audioreactive Particles</div>
    </div>

    <div ref="container" class="experiment-container"></div>

    <div class="music-label-container" :class="{'visible': showTrack}">
      <span>Music by Linkin Park - Faint</span>
    </div>
  </article>
</template>

<script>
import AudioreactiveParticles from '@/atoms/experiments/AudioreactiveParticles'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Particles from '@/atoms/experiments/Particles'

export default {
  name: 'FBOParticles',

  mixins: [FirePrerenderEvent],

  data () {
    return {
      track: '/static/audio/Linkin Park - Faint.mp3',
      audioreactive: false,
      fadeOverlay: false,
      showTrack: false
    }
  },

  methods: {
    setParticlesExperiment () {
      this.audioreactive = false
      this.fadeOverlay = true
      this.showTrack = false

      this.experiment.destroy()
      this.experiment = new Particles(this.$refs.container, this.$refs.overlay)

      setTimeout(() => {
        this.fadeOverlay = false
      }, 500)
    },

    setAudioreactiveExperiment () {
      this.audioreactive = true
      this.fadeOverlay = false
      this.showTrack = true

      this.experiment.destroy()
      this.experiment = new AudioreactiveParticles(this.$refs.container, this.track)

      setTimeout(() => {
        this.fadeOverlay = true
      }, 500)
    }
  },

  mounted () {
    this.$emit('update:title', 'FBOParticles')
    this.experiment = new Particles(this.$refs.container, this.$refs.overlay)
  },

  beforeDestroy () {
    if (this.experiment) {
      this.experiment.destroy()
    }
  },

  metaInfo: {
    title: 'FBOParticles |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'FBOParticles' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'FBOParticles' },

      { vmid: 'description', name: 'description', content: 'FBO Particles.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'FBO Particles.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'FBO Particles.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/FBOParticles.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/FBOParticles.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'z-index';

$label-background: rgba($black, 0.3);

.fbo-particles-page {
  background-image: radial-gradient(circle, #666, $black);
  background-color: $black;
  overflow: hidden;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;

  .background-overlay {
    background-color: $black;
    overflow: hidden;

    height: 100%;
    width: 100%;

    padding: 0;
    margin: 0;

    pointer-events: none;
    opacity: 1;

    &.fade {
      transition: opacity 0.5s linear;
      opacity: 0;
    }
  }

  .switch-container {
    border: 1px solid $silver;

    font-family: monospace;
    line-height: 25px;
    font-size: 14px;
    color: $silver;

    margin: 100px auto 0;
    position: fixed;
    cursor: pointer;
    z-index: $code;

    height: 25px;
    width: 400px;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    .button {
      transition: background-color 0.5s linear, color 0.5s linear;
      display: table-cell;
      text-align: center;
      width: 200px;

      &:first-child {
        border-right: 1px solid $silver;
      }

      &.active {
        background-color: $silver;
        color: $black;

        pointer-events: none;
        cursor: default;
      }
    }
  }

  .experiment-container {
    background-color: transparent;
    position: absolute;
    overflow: hidden;

    height: 100%;
    width: 100%;

    padding: 0;
    margin: 0;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }

  .music-label-container {
    transition: transform 0.5s ease-out;
    transform: translateY(-43px);

    background-color: $label-background;
    border-bottom-left-radius: 10px;

    padding: 15px 10px;
    font-size: 13px;
    color: $silver;

    position: absolute;
    z-index: $code;
    right: 0;
    top: 0;

    &.visible {
      transform: translateY(80px);
    }
  }
}
</style>
