<template>
  <main id="app">
    <MatrixRain v-if="visibleRain" :fullsize="fullsizeRain" @rain-columns="rainColumns = $event" />
    <Background :fullsize="fullsizeRain" :columns="rainColumns" />

    <router-view
      @toggle-overlay="visibleOverlay = $event"
      itemtype="https://schema.org/mainEntity"
      itemprop="mainEntity" class="page"
    />

    <ScreenOverlay v-if="visibleOverlay" />
  </main>
</template>

<script lang="ts">
import { Ref, ComputedRef, defineComponent, reactive, computed, ref } from 'vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import MatrixRain from '@components/MatrixRain.vue'
import Background from '@components/Background.vue'
import { isExperiment } from '@/utils'
import { useRoute } from 'vue-router'

interface TemplateValues {
  readonly fullsizeRain: ComputedRef<boolean>
  readonly visibleRain: ComputedRef<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly rainColumns: Ref<number>
}

export default defineComponent({
  name: 'App',

  components: {
    MatrixRain,
    Background,
    ScreenOverlay
  },

  props: {
    domain: {
      type: String,
      required: true
    },

    version: {
      type: String,
      required: true
    },

    deploy: {
      type: Boolean,
      required: true
    }
  },

  setup (): TemplateValues {
    console.log('%cCoffee is never too much.', 'background:#000; padding: 5px; color: #0C0;')

    const route = reactive(useRoute())
    const visibleOverlay = ref(true)
    const rainColumns = ref(0)

    const visibleRain = computed(() =>
      !['RabbitHole', '404'].includes(route.name as string) && !isExperiment(route.path)
    )

    const fullsizeRain = computed(() =>
      ['About', 'More', 'RabbitHole', 'Experiments'].includes(route.name as string)
    )

    return {
      visibleOverlay,
      fullsizeRain,
      visibleRain,
      rainColumns
    }
  }
})
</script>

<style lang="scss">
@import 'fonts';

html,
body {
  @include white-rabbit;
  cursor: none;
}

main {
  display: block;
  @include size;
}

canvas {
  @include absolute-size;
  left: 0;
  top: 0;
}

svg {
  transition: fill 0.5s ease-out;
  backface-visibility: hidden;

  fill: $dark-green;
  cursor: pointer;

  display: block;
  @include size;

  @include desktop-hover {
    fill: $green;
  }
}

p {
  backface-visibility: hidden;
  @include back-button;
  margin: 0px;
}

span.lettering {
  transition: opacity 0.5s $ease-in-out-cubic;
  backface-visibility: hidden;
  position: relative;

  &.dissolve {
    opacity: 0;
  }
}

.page {
  @include absolute-size;
  box-sizing: border-box;

  left: 0;
  top: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
