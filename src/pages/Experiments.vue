<template>
  <article itemtype="http://schema.org/WebPage" class="experiments-page" itemscope>
    <router-view class="page" />
  </article>
</template>

<script lang="ts">
import { SetupContext, defineComponent } from 'vue'

export default defineComponent({
  name: 'Experiments',

  setup (props, context: SetupContext): void {
    context.emit('toggle-overlay', false)
  }
})
</script>

<style lang="scss" scoped>
.experiments-page {
  cursor: auto;
}

::-webkit-scrollbar {
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
}
</style>
