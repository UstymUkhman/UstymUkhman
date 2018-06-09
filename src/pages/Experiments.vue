<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <MatrixRain v-if="rain" dense />

    <ScreenOverlay v-if="!platform.prerenderer" :class="{'obscured': obscured}" />

    <SiteHeader v-if="currentPage" :page="currentPage" :scroll="scrollable" />

    <transition appear>
      <router-view
        @obscure:background="obscured = $event"
        @update:title="currentPage = $event"
        class="page experiment-page"
      />
    </transition>

    <SiteFooter v-if="currentPage" :scroll="scrollable" />
  </article>
</template>

<script>
import ScreenOverlay from '@/atoms/ScreenOverlay'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'
import MatrixRain from '@/molecules/MatrixRain'
import Platform from '@/platform'

export default {
  name: 'Experiments',

  components: {
    ScreenOverlay,
    SiteHeader,
    SiteFooter,
    MatrixRain
  },

  data () {
    return {
      scrollable: this.$route.name === 'DynamicCss',
      platform: Platform,

      currentPage: null,
      obscured: false,
      rain: false
    }
  },

  watch: {
    '$route' (route) {
      this.scrollable = this.$route.name === 'DynamicCss'

      if (route.name === 'Experiments') {
        this.currentPage = null
      }
    }
  },

  mounted () {
    setTimeout(() => { this.rain = true }, 2000)
  },

  metaInfo: {
    title: 'Experiments |'
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.experiments-page {
  cursor: auto;

  .screen-overlay {
    background-color: rgba($black, 0.5);
    transition: background-color 0.5s;

    &.obscured {
      background-color: rgba($black, 0.8);
    }
  }

  .experiment-page {
    z-index: $screen;
  }
}
</style>
