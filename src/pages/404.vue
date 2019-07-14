<template>
  <article itemtype="http://schema.org/WebPage" itemscope></article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'

export default {
  name: '404',

  mixins: [FirePrerenderEvent],

  created () {
    this.$router.push({name: 'SiteMenu'})
  },

  metaInfo: {
    title: '404 |'
  }
}
</script>
