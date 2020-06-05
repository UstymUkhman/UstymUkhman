<template>
  <article itemtype="http://schema.org/ContactPage" class="contacts-page" itemscope>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Contacts',

  setup () {
    onMounted(() => {
      firePrerender({ title: 'Contacts' })
    })
  }
})
</script>

<style lang="scss" scoped>
.contacts-page {
  @include center-size;
  padding-left: 100px;

  overflow: hidden;
  z-index: 2;

  @include breakpoint($md) {
    padding-left: 50px;
  }

  @include breakpoint($sm-down) {
    padding: 0;
  }

  .contacts-list {
    position: absolute;
    margin: auto;
    bottom: auto;

    .list-container {
      top: 50%;
    }

    @include breakpoint($sm-down) {
      margin: 0 0 0 50px;
      height: 100%;
    }

    @include breakpoint($xs) {
      margin-left: 25px;
    }
  }
}
</style>
