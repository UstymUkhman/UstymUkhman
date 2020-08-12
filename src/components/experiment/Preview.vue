<template>
  <div ref="preview" itemtype="http://schema.org/WebPageElement" class="experiment-preview" itemscope>
    <router-link :title="experiment.title" :to="{name: experiment.title}" class="experiment-link">
      <div @mouseover="onMouseOver" @mouseout="onMouseOut" class="preview-content">

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
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Observer from '@/utils/ScrollObserver'
import { MouseEventListener } from '@/utils'

interface TemplateValues {
  readonly onMouseOver: MouseEventListener
  readonly onMouseOut: MouseEventListener
  readonly preview: Ref<HTMLDivElement>
  readonly video: Ref<HTMLVideoElement>
}

export default defineComponent({
  name: 'Preview',

  props: {
    experiment: {
      required: true,
      type: Object
    }
  },

  setup (): TemplateValues {
    const preview: Ref<HTMLDivElement> = ref()!
    const video: Ref<HTMLVideoElement> = ref()!

    let pauseTimeout: number

    function onMouseOver (): void {
      clearTimeout(pauseTimeout)
      video.value.play()
    }

    function onMouseOut (): void {
      pauseTimeout = window.setTimeout(() => {
        video.value.currentTime = 0.0
        video.value.pause()
      }, 500)
    }

    onMounted(() => {
      Observer.observe(preview.value)
    })

    onBeforeUnmount(() => {
      Observer.unobserve(preview.value)
    })

    return {
      onMouseOver,
      onMouseOut,
      preview,
      video
    }
  }
})
</script>

<style lang="scss" scoped>
$desktopHeight: 100 * 0.33 / 16 * 9;
$mobileHeight: 100 * 0.66 / 16 * 9;

.experiment-preview {
  @include size(33vw, #{$desktopHeight}vw);

  pointer-events: none;
  position: relative;
  margin: 5vw;

  .preview-content {
    transition: transform 0.5s $ease-out-back, border-color 0.75s ease-in, opacity 0.5s;
    will-change: transform, opacity;
    border: solid 3px transparent;

    backface-visibility: hidden;
    transform-origin: 50% 50%;
    transform: scale(0.5);

    position: relative;
    overflow: hidden;
    display: block;

    @include size;
    opacity: 0;
  }

  .experiment-overlay {
    backface-visibility: hidden;
    transition: opacity 0.75s;
    background-color: $black;

    @include absolute-size;
    pointer-events: none;
    opacity: 0.75;

    left: 0;
    top: 0;
  }

  video {
    @include absolute-size;
    pointer-events: none;
  }

  img {
    transition: transform 0.75s $ease-in-quart, opacity 0.5s 0.25s;
    backface-visibility: hidden;
    @include object-fit(cover);

    transform-origin: 50% 50%;
    pointer-events: none;
    position: absolute;

    display: block;
    @include size;
  }

  h5 {
    transition: opacity 0.25s 0.75s;
    backface-visibility: hidden;
    @include center-transform;

    pointer-events: none;
    white-space: nowrap;
    color: $green;
  }

  &:nth-child(even) .preview-content {
    transition-delay: 100ms;

    @include breakpoint($sm-down) {
      transition-delay: 0s;
    }
  }

  @include breakpoint($sm-down) {
    @include size(66vw, #{$mobileHeight}vw);
    margin: 10vw;
  }

  @include desktop-hover {
    .experiment-link {
      .preview-content {
        border-color: $green;
        transition-delay: 0s;
      }

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

  &.visible {
    pointer-events: all;

    .preview-content {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
