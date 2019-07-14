<template>
  <article itemtype="http://schema.org/WebPageElement" itemscope class="sound-particles-page">
    <transition appear>
      <canvas v-show="started" ref="canvas" />
    </transition>

    <transition appear>
      <TrackLabel v-if="started" author="John Newman" track="Love Me Again" />
    </transition>

    <StartButton v-if="!started" @click:start="startExperiment" />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import SoundParticles from '@/3D/experiments/SoundParticles'
import StartButton from '@/atoms/StartButton'
import TrackLabel from '@/atoms/TrackLabel'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'SoundParticles',

  mixins: [Viewport, FirePrerenderEvent],

  components: {
    StartButton,
    TrackLabel
  },

  data () {
    return {
      track: '/static/audio/love_me_again.mp3',
      experiment: null,
      started: false
    }
  },

  watch: {
    viewPort () {
      this.experiment.onResize()
    }
  },

  methods: {
    startExperiment () {
      this.experiment.startExperiment()
      this.started = true
    }
  },

  mounted () {
    this.experiment = new SoundParticles(this.$refs.canvas, this.track)
    this.experiment.initExperiment()
  },

  beforeDestroy () {
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
@import 'variables';

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
}
</style>
