<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <!-- <transition appear>
      <VideoBackground v-show="visibleBackground && !platform.prerenderer" class="background-video" />
    </transition> -->

    <MatrixRain dense />

    <SiteHeader v-if="currentPage" :page="currentPage" :scroll="scrollable" />

    <!-- @hide:background="visibleBackground = !$event" -->
    <transition appear>
      <router-view
        @update:title="currentPage = $event"
        class="page experiment-page"
      />
    </transition>

    <SiteFooter v-if="currentPage" :page="currentPage" :scroll="scrollable" />
  </article>
</template>

<script>
// import VideoBackground from '@/atoms/VideoBackground'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'
import MatrixRain from '@/molecules/MatrixRain'
// import Platform from '@/platform'

export default {
  name: 'Experiments',

  components: {
    // VideoBackground,
    SiteHeader,
    SiteFooter,
    MatrixRain
  },

  data () {
    return {
      scrollable: this.$route.name === 'DynamicCss',
      // visibleBackground: !Platform.mobile,
      // routes: ['Home', 'Experiments'],

      // platform: Platform,
      currentPage: null
    }
  },

  watch: {
    '$route' (route) {
      this.scrollable = this.$route.name === 'DynamicCss'

      // if (this.routes.includes(route.name)) {
      //   this.currentPage = null
      // }

      if (route.name === 'Experiments') {
        this.currentPage = null
      }

      // if (route.name === this.routes[1]) {
      //   this.visibleBackground = !Platform.mobile
      // }
    }
  },

  metaInfo: {
    title: 'Experiments |'
  }
}
</script>

<style scoped lang="scss">
@import 'z-index';

.experiments-page {
  cursor: auto;

  .experiment-page {
    z-index: $screen;
  }
}
</style>
