<template>
  <div id="app" v-show="!prerender">
    <router-view itemtype="https://schema.org/mainEntity" itemprop="mainEntity" class="page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Platform } from '@/utils'

export default defineComponent({
  name: 'App',

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

  setup (props): { prerender: boolean } {
    console.log('%cCoffee is never too much.', 'background:#000; padding: 5px; color: #0C0;')
    return { prerender: Platform.prerender }
  }
})
</script>

<style lang="scss">
@import 'mixins';
@import 'fonts';

html {
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
  -webkit-touch-callout: none;

  text-rendering: optimizeLegibility;
  font-variant-ligatures: none;
  backface-visibility: hidden;
  background-color: $black;
  text-size-adjust: none;

  @include white-rabbit;
  user-select: none;
  font-weight: 400;

  appearance: none;
  overflow: hidden;
  @include size;
  // cursor: none;

  max-height: 100%;
  min-height: 100%;

  max-width: 100%;
  min-width: 100%;

  padding: 0;
  margin: 0;
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

h1 {
  font-weight: 700;
  font-size: 48px;

  cursor: default;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 32px;
  }
}

h2 {
  font-weight: 400;
  font-size: 32px;

  cursor: default;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 25px;
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

.app-container {
  height: 100%;

  .background-video {
    position: fixed;

    @include breakpoint($sm-down) {
      display: none;
    }
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
