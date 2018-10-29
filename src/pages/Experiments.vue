<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <ScreenOverlay v-if="!prerenderer" />

    <SiteHeader v-if="currentPage" :page="currentPage" :scroll="scrollable" />

    <transition appear>
      <router-view
        @update:title="currentPage = $event"
        class="page experiment-page"
        ref="experimentView"
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
      prerenderer: Platform.prerenderer,
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
    if (this.$route.name === 'Experiments') {
      setTimeout(() => {
        this.$refs.experimentView.$el.onScroll()
      }, 1000)
    }

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
