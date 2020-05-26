<template>
  <article itemtype="http://schema.org/WebPage" class="more-page" itemscope>
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { JSONModel, JSONLoader } from '@/utils/3D/JSONLoader'
import AssetsLoader from '@/utils/3D/AssetsLoader'
import PILL from '@/assets/models/pill.json'
import { firePrerender } from '@/utils'
/* eslint-enable no-unused-vars */

export default defineComponent({
  name: 'More',

  setup (): void {
    function createPills (model: JSONModel) {
      console.log(model)
      // BLUE: 0x003FFF
      // RED:  0xB40000
    }

    const loader: AssetsLoader = new AssetsLoader()
    loader.loadJSON(new JSONLoader(), PILL, createPills)

    onMounted(() => {
      firePrerender({ title: 'More' })
    })

    onBeforeUnmount(() => {
      // cancelAnimationFrame(frame)
    })
  }
})
</script>

<style lang="scss" scoped>
.more-page {
  @include center-size;
  overflow: hidden;
}
</style>
