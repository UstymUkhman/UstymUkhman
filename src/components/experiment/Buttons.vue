<template>
  <div class="share-buttons" :class="{'visible': visible}">
    <div v-html="facebook" @click="socialPost('facebook')" itemtype="http://schema.org/ShareAction"></div>
    <div v-html="twitter" @click="socialPost('twitter')" itemtype="http://schema.org/ShareAction"></div>
    <a v-html="github" :href="repository" target="_blank" rel="noopener" itemtype="http://schema.org/LinkRole"></a>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref, onMounted } from 'vue'
import facebook from '@/assets/images/facebook.svg'
import twitter from '@/assets/images/twitter.svg'
import github from '@/assets/images/github.svg'

type Share = (social: string) => void

interface Buttons {
  readonly visible: Ref<boolean>
  readonly facebook: SVGElement
  readonly twitter: SVGElement
  readonly github: SVGElement
  readonly socialPost: Share
}

export default defineComponent({
  name: 'Buttons',

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
    const visible = ref(true)

    function socialPost (social: string): void {
      const page = encodeURIComponent(window.location.href)

      const url = social === 'facebook'
        ? `https://facebook.com/sharer.php?u=${page}`
        : `https://twitter.com/intent/tweet?url=${page}&text=${props.description}`

      window.open(url, '_blank', 'width=640,height=400,status=no,toolbar=no,titlebar=no,noopener=yes')
    }

    onMounted(() =>
      setTimeout(() => visible.value = false, 1500)
    )

    return {
      socialPost,
      facebook,
      twitter,
      visible,
      github
    }
  }
})
</script>

<style lang="scss" scoped>
.share-buttons {
  transition: transform 250ms ease-in, background-color 250ms;
  background-color: rgba($black, 0.5);

  backface-visibility: hidden;
  transform: translatex(35px);
  @include size(25px, 125px);

  position: absolute;
  display: block;

  margin: auto 0;
  padding: 10px;

  bottom: 0;
  right: 0;
  top: 0;

  &:hover,
  &.visible {
    background-color: rgba($black, 1);
    transform: translateX(0);
  }

  @include breakpoint($sm-down) {
    background-color: $black;
    transform: translateX(0);
    transition: none;
  }

  @include breakpoint($xs) {
    @include size(20px, 100px);
    padding: 10px 5px;
  }

  a,
  div {
    @include size(100%, 25px);
    margin-bottom: 25px;

    position: relative;
    display: block;

    &:last-child {
      margin-bottom: 0;
    }

    @include breakpoint($xs) {
      margin-bottom: 20px;
      height: 20px;
    }
  }
}
</style>
