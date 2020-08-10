<template>
  <div id="app">
    <MatrixRain v-if="visibleRain" @rain-columns="rainColumns = $event" />
    <Background :fullscreen="fullscreenRain" :columns="rainColumns" />

    <router-view
      @toggle-overlay="visibleOverlay = $event"
      itemtype="https://schema.org/mainEntity"
      itemprop="mainEntity" class="page"
    />

    <ScreenOverlay v-if="visibleOverlay" />
  </div>
</template>

<script lang="ts">
import { Ref, ComputedRef, defineComponent, reactive, computed, ref } from 'vue'
import ScreenOverlay from '@components/ScreenOverlay.vue'
import MatrixRain from '@components/MatrixRain.vue'
import Background from '@components/Background.vue'
import { useRoute } from 'vue-router'

interface TemplateValues {
  readonly fullscreenRain: ComputedRef<boolean>
  readonly visibleRain: ComputedRef<boolean>
  readonly visibleOverlay: Ref<boolean>
  readonly rainColumns: Ref<number>
}

export default defineComponent({
  name: 'App',

  components: {
    ScreenOverlay,
    MatrixRain,
    Background
  },

  props: {
    domain: {
      required: true,
      type: String
    },

    version: {
      required: true,
      type: String
    },

    deploy: {
      required: true,
      type: Boolean
    }
  },

  setup (): TemplateValues {
    console.log('%cCoffee is never too much.', 'background:#000; padding: 5px; color: #0C0;')

    const route = reactive(useRoute())
    const visibleOverlay = ref(true)
    const rainColumns = ref(0)

    const fullscreenRain = computed(() =>
      ['About', 'More', 'Experiments'].includes(route.name as string)
    )

    const visibleRain = computed(() =>
      !['RabbitHole', '404'].includes(route.name as string) &&
      !/experiments\/[^\n+]/.test(route.path)
    )

    return {
      fullscreenRain,
      visibleOverlay,
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
  @include size;
  // cursor: none;
}

#app {
  display: block;
  height: 100%;
  width: 100%;
}

canvas {
  position: absolute;
  z-index: $pills;

  left: 0;
  top: 0;

  .sound-particles-page & {
    @include center-size;

    padding: 0;
    margin: 0;
  }

  .color-grading-page & {
    position: relative;
  }
}

svg {
  transition: fill 0.5s ease-out;
  fill: $dark-green;
  cursor: pointer;

  display: block;
  @include size;

  @include desktop-hover {
    fill: $green;
  }
}

h1 {
  font-weight: 700;
  font-size: 48px;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 32px;
  }
}

h2 {
  font-weight: 400;
  font-size: 32px;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 25px;
  }
}

h5 {
  font-weight: 400;
  font-size: 2vw;
  margin: 0px;

  @include breakpoint($sm-down) {
    font-size: 30px;
  }

  @include breakpoint($xs) {
    font-size: 18px;
  }
}

p {
  @include back-button;
  margin: 0px;
}

span.lettering {
  transition: opacity 0.5s $ease-in-out-cubic;

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
