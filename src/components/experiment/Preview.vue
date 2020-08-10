<template>
  <div itemtype="http://schema.org/WebPageElement" class="experiment-preview" itemscope>
    <router-link :title="experiment.title" :to="{name: experiment.title}" class="experiment-link">

      <video
        :video="`public/videos/${experiment.video}`"
        :src="`public/videos/${experiment.video}`"
        ref="video" preload="auto"
        autoload muted loop>
      </video>

      <img
        :image="`public/img/${experiment.image}`"
        :src="`public/img/${experiment.image}`"
      />

      <div class="experiment-overlay"></div>
      <h5>{{ experiment.title }}</h5>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Preview',

  props: {
    experiment: {
      required: true,
      type: Object
    }
  }
})
</script>

<style lang="scss" scoped>
.experiment-preview {
  position: relative;
  overflow: hidden;

  margin: 5vw;
  width: 33vw;

  @include breakpoint($sm-down) {
    margin: 7.5vw;
    width: 66vw;
  }

  .experiment-overlay {
    transition: opacity 0.75s;
    background-color: $black;

    pointer-events: none;
    position: absolute;
    opacity: 0.75;

    height: 100%;
    width: 100%;

    left: 0;
    top: 0;
  }

  video {
    height: calc(100% - 2px);
    width: calc(100% - 2px);

    pointer-events: none;
    position: absolute;
  }

  img {
    transition: transform 0.75s $ease-in-quart, opacity 0.5s 0.25s;
    transform-origin: 50% 50%;

    pointer-events: none;
    position: relative;
    object-fit: cover;
    display: block;

    height: 100%;
    width: 100%;
  }

  h5 {
    transform: translate(-50%, -50%);
    transition: opacity 0.25s 0.75s;

    pointer-events: none;
    white-space: nowrap;
    position: absolute;

    color: $green;
    margin: auto;

    left: 50%;
    top: 50%;
  }

  .experiment-link:hover {
    .experiment-overlay {
      transition-delay: 0.25s;
      opacity: 0;
    }

    img {
      transform: scale(1.5);
      opacity: 0;
    }

    h5 {
      transition-delay: 0s;
      opacity: 0;
    }
  }
}
</style>
