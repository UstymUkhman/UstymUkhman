<template>
  <section itemtype="http://schema.org/ItemList" class="experiment-list" itemscope>
    <Preview
      :experiment="experiment" :style="{'height': `${previewHeight}px`}"
      itemtype="http://schema.org/ListItem" itemprop="itemListElement"
      v-for="experiment in experiments" :key="experiment.title"
    />
  </section>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, computed, onMounted } from 'vue'
import { Viewport, mobileWidth, firePrerender } from '@/utils'
import Preview from '@components/experiment/Preview.vue'

export default defineComponent({
  name: 'List',

  components: {
    Preview
  },

  props: {
    experiments: {
      required: true,
      type: Array
    }
  },

  setup (): { readonly previewHeight: ComputedRef<number> } {
    const screen = new Viewport()

    const previewHeight = computed(() => {
      const width = screen.size.width
      return width * (width < mobileWidth ? 0.66 : 0.33) / 16 * 9
    })

    onMounted(() => {
      firePrerender({ title: 'Experiments' })
    })

    return { previewHeight }
  }
})
</script>

<style lang="scss" scoped>
.experiment-list {
  -webkit-overflow-scrolling: touch;
  justify-content: space-evenly;

  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;

  padding: 2.5vw 0;
  flex-wrap: wrap;
  display: flex;

  @include breakpoint($sm-down) {
    padding: 5vw 0;
  }
}
</style>
