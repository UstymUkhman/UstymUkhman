<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="experiments-page">
    <transition appear>
      <VideoBackground v-show="visibleBackground && !platform.prerenderer" class="background-video" />
    </transition>

    <SiteHeader v-if="currentPage" :page="currentPage" :scroll="scrollable" />

    <transition appear>
      <router-view
        @hide:background="visibleBackground = !$event"
        @update:title="currentPage = $event"
        class="page experiment-page"
      />
    </transition>

    <SiteFooter v-if="currentPage" :page="currentPage" :scroll="scrollable" />
  </article>
</template>

<script>
import VideoBackground from '@/atoms/VideoBackground'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'
import Platform from '@/platform'

export default {
  name: 'Experiments',

  components: {
    VideoBackground,
    SiteHeader,
    SiteFooter
  },

  data () {
    return {
      scrollable: this.$route.name === 'DynamicCss',
      visibleBackground: !Platform.mobile,
      routes: ['Home', 'Experiments'],

      platform: Platform,
      currentPage: null
    }
  },

  watch: {
    '$route' (route) {
      this.scrollable = this.$route.name === 'DynamicCss'

      if (this.routes.includes(route.name)) {
        this.currentPage = null
      }

      if (route.name === this.routes[1]) {
        this.visibleBackground = !Platform.mobile
      }
    }
  },

  metaInfo: {
    title: 'Experiments'
  }
}
</script>

<style scoped lang="scss">
.experiments-page {
  cursor: auto;
}
</style>
