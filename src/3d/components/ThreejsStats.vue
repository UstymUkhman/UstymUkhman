<template>
  <div ref="container"></div>
</template>

<script>
import Stats from 'stats.js'
import RAF from '@/utils/RAF'

export default {
  name: 'ThreejsStats',

  data: function () {
    return {
      stats: new Stats()
    }
  },

  mounted: function () {
    this.stats.domElement.style.position = null
    this.stats.domElement.style.zIndex = null
    this.stats.domElement.style.top = null
    this.stats.domElement.style.left = null
    this.$refs.container.appendChild(this.stats.domElement)
    RAF.add(this.onUpdate)
  },

  beforeDestroy: function () {
    RAF.remove(this.onUpdate)
  },
  methods: {
    onUpdate: function () {
      this.stats.end()
      this.stats.begin()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
