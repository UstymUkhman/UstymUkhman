<template>
  <article ref="container" itemscope itemtype="http://schema.org/WebPageElement" class="sound-particles-page">
    <TrackLabel author="Music by John Newman" track="Love Me Again" />

    <transition appear name="warning">
      <div v-show="warning" class="warning-label-container">
        <span>Please, be aware than this experiment is running in low performance mode (128 particles)<br>
        'cause it seem that your GPU cannot handle its normal version (1024 particles).</span>
      </div>
    </transition>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import SoundParticles from '@/3D/experiments/SoundParticles'
import TrackLabel from '@/atoms/TrackLabel'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'SoundParticles',

  mixins: [Viewport, FirePrerenderEvent],

  components: {
    TrackLabel
  },

  data () {
    return {
      track: '/static/audio/love_me_again.mp3',
      experiment: null,
      warning: false
    }
  },

  methods: {
    createExperiment (weak) {
      this.experiment = new SoundParticles(this.$refs.container, this.track, weak)
      window.addEventListener('resize', this._onResize)

      this.experiment.startExperiment()
      this.onResize()
    },

    onError () {
      window.removeEventListener('resize', this._onResize)
      setTimeout(() => { this.warning = true }, 2000)

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
@import 'easings';

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

  .warning-label-container {
    background-color: rgba($black, 0.3);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;

    letter-spacing: 0.5px;
    text-align: center;
    line-height: 18px;
    font-weight: 300;
    font-size: 13px;
    color: $silver;

    position: absolute;
    padding: 15px 10px;
    z-index: $code;
    margin: 0 auto;
    width: 600px;

    bottom: 0;
    right: 0;
    left: 0;
  }
}

.warning-enter-active {
  transition: transform 0.5s $ease-out-quad;
}

.warning-enter {
  transform: translateY(100%);
}
</style>
