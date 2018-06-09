<template>
  <div class="buttons-container">
    <a :href="repo" target="_blank"><GitHubButton class="header-button github" :class="{'single': !showDownload}" /></a>
    <DownloadButton v-if="showDownload" class="header-button download" @click.native="$emit('download')" />
  </div>
</template>

<script>
import DownloadButton from '@/assets/svg/download.svg'
import GitHubButton from '@/assets/svg/github.svg'

export default {
  name: 'HeaderButtons',

  props: {
    repo: {
      type: String,
      required: true
    },

    showDownload: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  components: {
    DownloadButton,
    GitHubButton
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.buttons-container {
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

  position: absolute;
  fill: $dark-green;
  cursor: pointer;

  height: 25px;
  width: 25px;
  top: 50%;

  @include breakpoint($xs) {
    height: 20px;
    width: 20px;
  }

  &:hover {
    fill: $green;
  }

  &.github {
    right: 75px;

    @include breakpoint($xs) {
      right: 45px;
    }

    &.single {
      right: 25px;

      @include breakpoint($xs) {
        right: 10px;
      }
    }
  }

  &.download {
    right: 25px;

    @include breakpoint($xs) {
      right: 10px;
    }
  }
}
</style>
