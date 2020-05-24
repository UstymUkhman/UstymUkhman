<template>
  <div class="header-buttons">
    <!-- <a :href="github" target="_blank"><GitHubButton class="header-button github" /></a> -->
  </div>
</template>

<script lang="ts">
// import FacebookButton from '@/assets/img/github.svg'
// import TwitterButton from '@/assets/img/github.svg'
// import GithubButton from '@/assets/img/github.svg'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperimentButtons',

  // components: {
  //   FacebookButton,
  //   TwitterButton,
  //   GithubButton
  // },

  props: {
    github: {
      required: true,
      type: String
    }
  },

  setup (props) {
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.header-buttons {
  padding-right: 25px;
  position: absolute;

  height: 100%;
  right: 0;

  @include breakpoint($xs) {
    padding-right: 10px;
  }
}

.header-button {
  transition: fill 0.5s ease-out;
  transform: translateY(-50%);
  @include size(25px);

  position: absolute;
  fill: $dark-green;
  cursor: pointer;
  top: 50%;

  @include breakpoint($xs) {
    @include size(20px);
  }

  &:hover {
    fill: $green;
  }

  // &.github {
  //   right: 75px;

  //   @include breakpoint($xs) {
  //     right: 45px;
  //   }
  // }
}
</style>
