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
    const loader = new AssetsLoader()

    function createPill (model: JSONModel) {
      console.log(model)
    }

    function loadPill (color: number) {
      loader.loadJSON(new JSONLoader(), PILL, createPill)
    }

    loadPill(0x003FFF)
    // loadPill(0xB40000)

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
@import 'mixins';

.more-page {
  @include center-size;
  overflow: hidden;
}
</style>
