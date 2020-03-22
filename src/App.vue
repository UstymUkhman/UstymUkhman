<template>
  <div id="app" v-show="!prerender">
    <router-view itemtype="https://schema.org/mainEntity" itemprop="mainEntity" class="page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import platform from '@/platform'

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
    console.table(props)

    return {
      prerender: platform.prerender
    }
  }
})
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  // background-color: $black;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  transition: background-color 0.5s;
  // background-color: $dark-green;
}

// ::-webkit-scrollbar-thumb:hover,
// ::-webkit-scrollbar-thumb:active {
//   background-color: $green;
// }
</style>
