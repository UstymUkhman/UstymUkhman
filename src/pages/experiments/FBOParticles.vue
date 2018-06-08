<template>
  <article ref="container" itemscope itemtype="http://schema.org/WebPageElement" class="fbo-particles-page">
    <div class="switch-container">
      <div @click="setParticlesExperiment" class="button" :class="{'active': !audioreactive}">Noise Particles</div>
      <div @click="setAudioreactiveExperiment" class="button" :class="{'active': audioreactive}">Audioreactive Particles</div>
    </div>

    <div ref="container" class="experiment-container"></div>

    <transition appear>
      <TrackLabel v-show="audioreactive" author="Linkin Park" track="Faint" />
    </transition>
  </article>
</template>

<script>
import AudioreactiveParticles from '@/3D/experiments/AudioreactiveParticles'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Particles from '@/3D/experiments/Particles'
import TrackLabel from '@/atoms/TrackLabel'

export default {
  name: 'FBOParticles',

  mixins: [FirePrerenderEvent],

  components: {
    TrackLabel
  },

  data () {
    return {
      track: '/static/audio/faint.mp3',
      audioreactive: false
    }
  },

  methods: {
    setParticlesExperiment () {
      this.audioreactive = false
      this.experiment.destroy()
      this.experiment = new Particles(this.$refs.container, this.$refs.overlay)
    },

    setAudioreactiveExperiment () {
      this.audioreactive = true
      this.experiment.destroy()
      this.experiment = new AudioreactiveParticles(this.$refs.container, this.track)
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

.fbo-particles-page {
  background-color: $black;
  overflow: hidden;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;

  .switch-container {
    border: 1px solid $green;

    font-family: monospace;
    line-height: 25px;
    font-size: 14px;
    color: $green;

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
        border-right: 1px solid $green;
      }

      &.active {
        background-color: $green;
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
}
</style>
