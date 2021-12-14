<template>
  <div ref="preview" itemtype="http://schema.org/WebPageElement" class="experiment-preview" itemscope>
    <component
      :to="{name: experiment.title}" :href="experiment.page"
      :target="experiment.newTab ? '_blank' : '_self'"
      :is="experiment.newTab ? 'a' : 'router-link'"
      :title="experiment.description">

      <div @mouseover="onMouseOver" @mouseout="onMouseOut" class="preview-content">
        <video
          :video="`public/videos/${experiment.video}`"
          :src="`public/videos/${experiment.video}`"
          itemtype="http://schema.org/VideoObject"
          ref="video" preload="auto"
          autoload muted loop>
        </video>

        <img
          :image="`public/img/${experiment.image}`"
          itemtype="http://schema.org/ImageObject"
          :src="`public/img/${experiment.image}`"
        />

        <div class="experiment-overlay"></div>
        <h5 itemprop="name">{{ experiment.title }}</h5>
      </div>
    </component>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { Observer, MouseEventListener } from '@/utils'

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
      type: Object,
      required: true
    }
  },

  setup (): TemplateValues {
    let pauseTimeout: number
    const preview = ref()
    const video = ref()

    function onMouseOver (): void {
      clearTimeout(pauseTimeout)
      video.value.play()
    }

    function onMouseOut (): void {
      pauseTimeout = setTimeout(() => {
        if (!video.value) return;
        video.value.currentTime = 0.0
        video.value.pause()
      }, 500)
    }

    onMounted(() => Observer.observe(preview.value))

    onBeforeUnmount(() => Observer.unobserve(preview.value))

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
$desktopHeight: 0.33 / 16 * 9;
$mobileHeight: 0.66 / 16 * 9;

.experiment-preview {
  @include size(
    calc(var(--width) * 0.33),
    calc(var(--width) * #{$desktopHeight})
  );

  @include vw(padding, 5);
  pointer-events: none;
  position: relative;

  .preview-content {
    transition: transform 0.5s $ease-out-back, border-color 0.75s ease-in, opacity 0.5s;
    will-change: transform, opacity;
    border: solid 3px transparent;

    backface-visibility: hidden;
    transform-origin: 50% 50%;
    transform: scale(0.5);

    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: block;

    @include size;
    opacity: 0;

    @include desktop-hover {
      border-color: $green;
      transition-delay: 0s;

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
    @include vw(font-size, 2);

    pointer-events: none;
    white-space: nowrap;
    font-weight: 400;

    color: $green;
    margin: 0px;

    @include breakpoint($sm-down) {
      font-size: 30px;
    }

    @include breakpoint($xs) {
      font-size: 18px;
    }
  }

  &:nth-child(even) .preview-content {
    transition-delay: 100ms;

    @include breakpoint($sm-down) {
      transition-delay: 0s;
    }
  }

  @include breakpoint($sm-down) {
    @include size(
      calc(var(--width) * 0.66),
      calc(var(--width) * #{$mobileHeight})
    );

    @include vw(padding, 10);
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
