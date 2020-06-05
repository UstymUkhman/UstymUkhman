<template>
  <article itemtype="http://schema.org/CollectionPage" class="works-page" itemscope>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { firePrerender } from '@/utils'

export default defineComponent({
  name: 'Works',

  setup () {
    onMounted(() => {
      firePrerender({ title: 'Works' })
    })
  }
})
</script>

<style lang="scss" scoped>
.my-works-page {
  @include center-size;
  overflow: hidden;
  z-index: 2;

  @include breakpoint($sm-down) {
    overflow: visible;
  }

  &.small-list {
    .projects-list {
      transition: opacity 1s;
      bottom: auto;
      top: 50%;
    }

    @include breakpoint($sm-down) {
      overflow: hidden;
    }
  }

  .works-counter {
    text-align: center;
    position: absolute;
    width: 100%;

    bottom: auto;
    right: auto;
    top: 50px;
    left: 0;

    span {
      @include white-rabbit;
    }

    @media only screen and (max-height: 550px) {
      top: 25px;
    }
  }

  .matrix-rain {
    @include absolute-size;
    pointer-events: none;
    width: 50%;

    right: auto;
    bottom: 0;
    left: 50%;
    top: 0;

    @include breakpoint($sm-down) {
      position: fixed;
      width: 100%;
      left: 0;
    }
  }
}
</style>
