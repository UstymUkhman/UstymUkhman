<template>
  <article ref="container" itemscope itemtype="http://schema.org/WebPageElement" class="sound-particles-page">
    <div class="music-label-container" :class="{'visible': showTrack}">
      <span>Music by John Newman - Love Me Again</span>
    </div>

    <div class="warning-label-container" :class="{'visible': showWarning}">
      <span>Please, be aware than this experiment is running in low performance mode (128 particles)<br>
      'cause it seem that your GPU cannot handle its normal version (1024 particles).</span>
    </div>
  </article>
</template>

<script>
import SoundParticles from '@/atoms/experiments/SoundParticles'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'SoundParticles',

  mixins: [Viewport, FirePrerenderEvent],

  data () {
    return {
      track: '/static/audio/John Newman - Love Me Again.mp3',
      showWarning: false,
      showTrack: false,
      experiment: null
    }
  },

  methods: {
    createExperiment (weak) {
      this.experiment = new SoundParticles(this.$refs.container, this.track, weak)
      window.addEventListener('resize', this._onResize)
      setTimeout(() => { this.showTrack = true }, 1500)

      this.experiment.startExperiment()
      this.onResize()
    },

    onError () {
      setTimeout(() => { this.showWarning = true }, 2000)
      window.removeEventListener('resize', this._onResize)

      if (this.experiment) {
        this.experiment.destroy()
      }

      this.createExperiment(true)
    },

    onResize () {
      this.experiment.resize(this.viewPort.width, this.viewPort.height)
    }
  },

  mounted () {
    this._onResize = this.onResize.bind(this)
    this._onError = this.onError.bind(this)

    window.addEventListener('error', this._onError)
    this.$emit('update:title', 'SoundParticles')
    this.createExperiment()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('error', this._onError)

    if (this.experiment) {
      this.experiment.destroy()
    }
  },

  metaInfo: {
    title: 'SoundParticles |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'SoundParticles' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'SoundParticles' },

      { vmid: 'description', name: 'description', content: 'Audioreactive Sphere Particles.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'Audioreactive Sphere Particles.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'Audioreactive Sphere Particles.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/SoundParticles.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/SoundParticles.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'z-index';

$label-background: rgba($black, 0.3);

.sound-particles-page {
  filter: sepia(10%);
  user-select: none;

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

  div.music-label-container {
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

  div.warning-label-container {
    transition: transform 0.5s ease-out;
    transform: translateY(91px);

    background-color: $label-background;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;

    letter-spacing: 0.5px;
    text-align: center;
    line-height: 18px;
    font-size: 13px;
    color: $silver;

    position: absolute;
    padding: 15px 10px;
    margin: 0 auto;
    width: 600px;
    z-index: 1;

    bottom: 0;
    right: 0;
    left: 0;

    &.visible {
      transform: translateY(-25px);
    }
  }
}
</style>
