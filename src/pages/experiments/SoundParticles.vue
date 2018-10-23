<template>
  <article ref="container" itemscope itemtype="http://schema.org/WebPageElement" class="sound-particles-page">
    <TrackLabel author="John Newman" track="Love Me Again" />
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
      experiment: null
    }
  },

  watch: {
    viewPort () {
      this.experiment.onResize()
    }
  },

  methods: {
    createExperiment () {
      this.experiment = new SoundParticles(this.$refs.container, this.track)
      this.experiment.startExperiment()
    }
  },

  mounted () {
    this.$emit('update:title', 'SoundParticles')
    this.createExperiment()
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
