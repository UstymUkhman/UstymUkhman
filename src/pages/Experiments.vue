<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <ScreenOverlay v-if="!prerenderer" />

    <SiteHeader v-if="experiment" :experiment="experiment" :scroll="scrollable" />

    <transition appear>
      <router-view ref="experimentView" class="page experiment-page" />
    </transition>

    <SiteFooter v-if="experiment" :scroll="scrollable" />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Experiments from '@/assets/data/experiments.json'

import ScreenOverlay from '@/atoms/ScreenOverlay'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'

import Platform from '@/platform'
import find from 'lodash.find'

export default {
  name: 'Experiments',

  mixins: [FirePrerenderEvent],

  components: {
    ScreenOverlay,
    SiteHeader,
    SiteFooter
  },

  data () {
    return {
      scrollable: this.$route.name === 'DynamicCss',
      prerenderer: Platform.prerenderer,
      experiment: null
    }
  },

  watch: {
    $route (route) {
      this.experiment = find(Experiments, { route: route.name }) || null
      this.scrollable = route.name === 'DynamicCss'
      this.toggleRain()
    }
  },

  methods: {
    toggleRain () {
      const experiment = Experiments.indexOf(this.experiment)
      const raining = !(experiment > -1 && experiment < 6)
      this.$emit('toggle:rain', raining)
    }
  },

  mounted () {
    if (this.$route.name === 'Experiments') {
      setTimeout(() => { this.$refs.experimentView.$el.onScroll() }, 1000)
    } else {
      this.experiment = find(Experiments, { route: this.$route.name })
    }

    setTimeout(this.toggleRain.bind(this), 1000)
    this.$emit('hide:overlay')
  },

  metaInfo: {
    title: 'Experiments |'
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.experiments-page {
  -webkit-overflow-scrolling: touch;
  cursor: auto;

  .screen-overlay {
    background-color: rgba($black, 0.75);
  }

  .experiment-page {
    z-index: $screen;
  }
}
</style>
