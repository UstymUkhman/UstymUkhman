<template>
  <div class="header-buttons">
    <div v-html="facebook" @click="socialShare('facebook')"></div>
    <div v-html="twitter" @click="socialShare('twitter')"></div>
    <a v-html="github" :href="repository" target="_blank"></a>
  </div>
</template>

<script lang="ts">
import facebook from '@/assets/img/facebook.svg'
import twitter from '@/assets/img/twitter.svg'
import github from '@/assets/img/github.svg'
import { defineComponent } from 'vue'

type Share = (social: string) => void

interface Buttons {
  readonly socialShare: Share
  readonly facebook: string
  readonly twitter: string
  readonly github: string
}

export default defineComponent({
  name: 'ExperimentButtons',

  props: {
    description: {
      type: String,
      required: true
    },

    repository: {
      type: String,
      required: true
    }
  },

  setup (props): Buttons {
    function socialShare (social: string): void {
      const page: string = encodeURIComponent(window.location.href)

      const url: string = social === 'facebook'
        ? `https://facebook.com/sharer.php?u=${page}`
        : `https://twitter.com/intent/tweet?url=${page}&text=${props.description}`

      window.open(url, '_blank', 'width=640,height=400,status=no,toolbar=no,titlebar=no')
    }

    return {
      socialShare,
      facebook,
      twitter,
      github
    }
  }
})
</script>

<style lang="scss" scoped>
.header-buttons {
  justify-content: space-between;
  align-content: center;

  @include size(150px);
  padding-right: 25px;
  align-items: center;

  margin-left: auto;
  display: flex;

  @include breakpoint($xs) {
    padding-right: 10px;
    width: 120px;
  }

  a,
  div {
    cursor: pointer;
    @include size(25px, 25px);

    @include breakpoint($xs) {
      @include size(20px, 20px);
    }

    @include desktop-hover {
      svg {
        fill: $green;
      }
    }

    svg {
      transition: fill 0.5s ease-out;
      fill: $dark-green;

      display: block;
      @include size;
    }
  }
}
</style>
