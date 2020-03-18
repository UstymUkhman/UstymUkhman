<template>
  <div id="app">
    <span>{{ hello }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const hello = 'Hello from Vue 3 & TypeScript'
    return { hello }
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
