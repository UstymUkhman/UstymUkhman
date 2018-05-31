<template>
  <a class="animation-button" :class="{'text-color': colorTransition}">{{animation}}</a>
</template>

<script>
export default {
  name: 'AnimationButton',

  props: {
    animation: {
      type: String,
      required: true
    },

    colorTransition: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';

.animation-button {
  border: solid 1px $dark-green;
  background-color: $black;
  padding: 5px 16px;
  border-radius: 0;

  font-family: 'Roboto';
  font-weight: 300;
  font-size: 16px;

  text-decoration: none;
  letter-spacing: 1px;
  text-align: center;
  line-height: 20px;
  color: $dark-green;

  min-height: 20px;
  min-width: 125px;

  cursor: pointer;
  outline: none;

  &.text-color {
    transition: color 1s 0.25s;

    &:hover,
    &:focus,
    &:active {
      color: $black;
    }
  }

  &.hvr-ripple-in:hover {
    color: $green;
  }

  &.hvr-ripple-out {
    border-width: 0px;

    &:hover {
      color: $green;
    }
  }

  &.hvr-underline-from-left,
  &.hvr-underline-from-right,
  &.hvr-overline-from-left,
  &.hvr-overline-from-right {
    transition: border-color 0.25s;

    &:hover {
      border-color: transparent;
    }
  }
}
</style>
