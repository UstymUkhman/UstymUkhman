<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <span>{{ hello }}</span>
  </article>
</template>

<script lang="ts">
import firePrerenderEvent from '@/utils/firePrerenderEvent'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Home',

  setup () {
    const hello = 'Hello from Vue 3 & TypeScript'

    onMounted(firePrerenderEvent)

    return { hello }
  }
})
</script>
