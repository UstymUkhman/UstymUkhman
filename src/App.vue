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

  setup (props) {
    console.log('%cCoffee is never too much.', 'background:#000; padding: 5px; color: #0C0;')

    return {
      prerender: Platform.prerender
    }
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

  font-family: 'White Rabbit', monospace;
  text-rendering: optimizeLegibility;
  font-variant-ligatures: none;
  text-size-adjust: none;
  font-weight: 400;

  backface-visibility: hidden;
  background-color: $black;
  appearance: none;
  color: $green;

  user-select: none;
  overflow: hidden;
  // cursor: none;

  max-height: 100%;
  min-height: 100%;

  max-width: 100%;
  min-width: 100%;

  height: 100%;
  width: 100%;

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

  cursor: default;
  margin: 0px;
}

span.lettering {
  transition: opacity 0.5s $ease-in-out-cubic;

  &.dissolve {
    opacity: 0;
  }
}

a {
  text-decoration: none;
  cursor: pointer;
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

article.image-drawer-js-page .code-container .code-preview {
  @include code-editor;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* ::-webkit-scrollbar {
  background-color: $black;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  transition: background-color 0.5s;
  background-color: $dark-green;
}

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: $green;
} */
</style>
