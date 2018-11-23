<template>
  <div class="experiment-container">
    <div class="experiment-preview" :class="{'right': right}" @mouseover="onMouseOver" @mouseout="onMouseOut">
      <video ref="video" :src="'/static/video/' + route + '.mp4'" preload="auto" muted loop></video>

      <router-link :title="name" :to="{name: route}" class="experiment-link">
        <div class="cover-image" :class="{'zoom': zoom}" :style="{'background-image': 'url(/static/img/experiments/' + route + '.jpg)'}"></div>
        <div v-if="name" class="cover-overlay"></div>
        <h3 v-if="name" class="title">{{ name }}</h3>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExperimentPreview',

  props: {
    name: {
      type: String,
      required: true
    },

    route: {
      type: String,
      required: true
    },

    right: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      cancel: false,
      zoom: false
    }
  },

  methods: {
    onMouseOver () {
      setTimeout(() => {
        if (this.$refs.video && !this.cancel) {
          this.$refs.video.play()
          this.zoom = true
        }

        this.cancel = false
      }, 200)
    },

    onMouseOut () {
      if (this.$refs.video) {
        this.$refs.video.currentTime = 0.0
        this.$refs.video.pause()
        this.cancel = true

        setTimeout(() => {
          if (this.zoom) {
            this.cancel = false
            this.zoom = false
          }
        }, 500)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.experiment-container {
  transform-style: preserve-3d;
  perspective: 800px;

  position: absolute;
  overflow: hidden;
  cursor: default;

  height: 100%;
  width: 100%;

  @include breakpoint($sm-down) {
    transform-style: unset;
    perspective: none;
    margin: auto;

    height: 80%;
    width: 80%;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }
}

.experiment-preview {
  transform: translateX(20%) scale(0.8) rotate3d(0, 1, 0, 30deg);
  transform-origin: 0 50%;

  position: absolute;
  overflow: hidden;
  cursor: pointer;

  height: 100%;
  width: 100%;

  &:hover {
    .title,
    .cover-overlay {
      opacity: 0;
    }

    @include breakpoint($sm-down) {
      transform: none;
    }
  }

  &.right {
    transform: translateX(-20%) scale(0.8) rotate3d(0, 1, 0, -30deg);
    transform-origin: 100% 50%;

    @include breakpoint($sm-down) {
      transform-origin: unset;
      transform: none;
    }

    &:hover {
      @include breakpoint($sm-down) {
        transform: none;
      }
    }
  }

  @include breakpoint($sm-down) {
    transform-origin: unset;
    transition: none;
    transform: none;
  }

  video {
    height: calc(100% - 2px);
    width: calc(100% - 2px);

    pointer-events: none;
    position: absolute;
  }

  .experiment-link {
    position: absolute;
    height: 100%;
    width: 100%;

    .title {
      transition: opacity 0.5s linear 0.25s;
      font-family: 'White Rabbit';
      font-size: 50px;

      pointer-events: none;
      text-align: center;
      position: absolute;
      display: block;

      margin-top: 25.5%;
      color: $green;
      width: 100%;

      @include breakpoint($xs) {
        margin-top: 23%;
        font-size: 25px;
      }
    }
  }

  .cover-overlay {
    transition: opacity 0.5s linear 0.25s;
    background-color: $black;

    pointer-events: none;
    position: absolute;
    opacity: 0.6;

    height: 100%;
    width: 100%;
  }
}

.cover-image {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  pointer-events: all;
  position: absolute;

  height: 100%;
  width: 100%;

  &.zoom {
    transition: transform 0.75s $ease-in-quart, opacity 0.5s linear 0.25s;
    transform-origin: 50% 50%;
    transform: scale(1);

    &:hover {
      transform: scale(1.5);
      opacity: 0;
    }
  }
}
</style>
