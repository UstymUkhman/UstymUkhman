<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{'transform': `scaleX(${value / max})`}"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    min: {
      default: 0,
      type: Number,
      required: false,

      validator: (value) => {
        return value > -1
      }
    },

    max: {
      type: Number,
      default: 100,
      required: false,

      validator: (value) => {
        return value > 0
      }
    },

    value: {
      default: 0,
      type: Number,
      required: false,

      validator: (value) => {
        return value > -1
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.progress-bar {
  transition: transform 100ms ease-out;
  transform-origin: 0% 50%;
  transform: scaleX(0);

  background-color: $green;

  height: 100%;
  width: 100%;
}
</style>
