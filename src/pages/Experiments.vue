<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <ScreenOverlay v-if="!platform.prerenderer" />

    <SiteHeader v-if="currentPage" :page="currentPage" :scroll="scrollable" :experiment="currentExperiment" />

    <transition appear>
      <router-view
        @set:experiment="currentExperiment = $event"
        @update:title="currentPage = $event"
        class="page experiment-page"
      />
    </transition>

    <SiteFooter v-if="currentPage" :scroll="scrollable" />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import ScreenOverlay from '@/atoms/ScreenOverlay'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'
import Platform from '@/platform'

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
      currentExperiment: null,
      platform: Platform,
      currentPage: null,
      rain: false
    }
  },

  watch: {
    $route (route) {
      this.scrollable = this.$route.name === 'DynamicCss'

      if (route.name === 'Experiments') {
        this.currentPage = null
      }
    }
  },

  mounted () {
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
