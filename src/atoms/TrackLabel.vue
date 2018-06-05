<template>
  <transition appear name="label">
    <div class="label-container">
      <span>Music by: {{ author }}</span><span v-if="track"> - {{ track }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TrackLabel',

  props: {
    author: {
      type: String,
      required: true
    },

    track: {
      type: String,
      default: null,
      required: false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'z-index';
@import 'easings';

.label-container {
  background-color: rgba($black, 0.3);
  border-bottom-left-radius: 10px;

  letter-spacing: 0.5px;
  padding: 15px 10px;
  font-weight: 300;
  font-size: 13px;
  color: $silver;

  position: absolute;
  z-index: $code;
  right: 0;
  top: 0;
}

.label-enter-active {
  transition: transform 0.5s $ease-out-quad;
}

.label-enter {
  transform: translateY(-100%);
}
</style>
