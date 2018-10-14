<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="dynamic-css-page" :class="{'scroll': scrollable}">
    <div class="element-container">
      <AnimatedElement ref="element" class="element dynamic" :class="currentAnimation" />
    </div>

    <div class="buttons-container">
      <div v-for="category in categories" :key="category.name" class="category-container">
        <AnimationCategory :name="category.name" class="category-name" />
          <div v-for="(row, r) in category.animations" :key="r" class="category-row">

            <AnimationButton
              class="button-element"
              v-for="animation in row"
              :class="animation.classes"
              :key="animation.classes[0]"
              :animation="animation.name"
              :colorTransition="animation.color"
              @click.native="onAnimationClick(animation.classes[0])"
            />

          </div>
      </div>
    </div>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Animations from '@/assets/data/animations'

import AnimationCategory from '@/atoms/AnimationCategory'
import AnimatedElement from '@/atoms/AnimatedElement'
import AnimationButton from '@/atoms/AnimationButton'

export default {
  name: 'DynamicCss',

  mixins: [FirePrerenderEvent],

  components: {
    AnimationCategory,
    AnimatedElement,
    AnimationButton
  },

  data () {
    return {
      currentAnimation: null,
      categories: Animations,
      scrollable: false
    }
  },

  methods: {
    onAnimationClick (animation) {
      this.currentAnimation = animation
    },

    onAnimationEnd () {
      setTimeout(() => {
        this.currentAnimation = null
      }, 250)
    }
  },

  mounted () {
    this.$emit('update:title', 'Dynamic.css')
    setTimeout(() => { this.scrollable = true }, 500)

    this._onAnimationEnd = this.onAnimationEnd.bind(this)
    this.$refs.element.$el.addEventListener('animationend', this._onAnimationEnd)
  },

  beforeDestroy () {
    this.$refs.element.$el.removeEventListener('animationend', this._onAnimationEnd)
  },

  metaInfo: {
    title: 'Dynamic.css |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'Dynamic.css' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'Dynamic.css' },

      { vmid: 'description', name: 'description', content: 'Awesome Library of CSS3 animations.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'Awesome Library of CSS3 animations.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'Awesome Library of CSS3 animations.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/DynamicCss.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/DynamicCss.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/css/dynamic.min.css';
@import '~hover.css/scss/hover';
@import 'animations';
@import 'variables';

.dynamic-css-page {
  overflow: hidden;
  height: 100%;

  &.scroll {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .element-container {
    pointer-events: none;
    position: fixed;

    height: 100%;
    width: 33%;
    left: 0;

    @include breakpoint($sm-down) {
      height: 100px;
      width: 100%;

      top: 100px;
      z-index: 1;
    }

    @include breakpoint($xs) {
      top: 75px;
    }

    .element {
      position: absolute;
      margin: auto;

      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
    }
  }

  .buttons-container {
    position: absolute;
    margin-top: 150px;

    height: 100%;
    width: 66%;
    right: 0;

    @include breakpoint($sm-down) {
      margin-top: 250px;
      width: 80%;
      left: 10%;
    }

    @include breakpoint($xs) {
      margin-top: 200px;
      width: 95%;
      left: 2.5%;
    }
  }

  .category-container {
    text-align: center;
    margin: 0 0 100px;
    padding: 15px 0;

    @include breakpoint($xs) {
      margin-bottom: 50px;
    }

    &:last-child {
      margin-bottom: 150px;

      @include breakpoint($sm-down) {
        margin-bottom: 50px;
      }
    }

    .category-row {
      margin: 0 auto 50px;
      position: relative;
      display: block;

      height: 30px;
      width: 600px;

      @include breakpoint($sm-down) {
        width: 100%;
      }
    }

    .button-element {
      display: inline-block;
      position: relative;

      &.left {
        float: left;
      }

      &.center {
        float: none;
        margin: 0 auto;
        display: block;
        max-width: 159px;
      }

      &.right {
        float: right;
      }
    }
  }
}

.button-element {
  &.jump::before {
    background-color: $green;
  }

  &.blink {
    animation-name: hvr-back-pulse;

    &:hover,
    &:focus,
    &:active {
      background-color: $green;
    }
  }

  &.hvr-radial-out,
  &.hvr-rectangle-out,
  &.hvr-shutter-out-vertical,
  &.hvr-shutter-out-horizontal {
    background-color: $black;
  }

  &.hvr-ripple-in::before {
    border-color: $dark-green;
    border-width: 1px;
  }

  &.hvr-ripple-out::before {
    border-color: $dark-green;
    border-width: 1px;
  }

  &.hvr-shutter-in-vertical,
  &.hvr-rectangle-in {
    background-color: $green;

    &::before {
      background: $black;
    }
  }

  &.hvr-shutter-out-horizontal::before,
  &.hvr-shutter-out-vertical::before,
  &.hvr-underline-from-left::before,
  &.hvr-underline-from-right::before,
  &.hvr-overline-from-left::before,
  &.hvr-overline-from-right::before,
  &.hvr-bounce-to-right::before,
  &.hvr-bounce-to-left::before,
  &.hvr-bounce-to-bottom::before,
  &.hvr-rectangle-out::before,
  &.hvr-sweep-to-top::before,
  &.hvr-sweep-to-bottom::before,
  &.hvr-sweep-to-left::before,
  &.hvr-sweep-to-right::before,
  &.hvr-radial-out::before,
  &.hvr-radial-in {
    background: $green;
  }

  &.hvr-shutter-in-vertical::before,
  &.hvr-radial-in::before {
    background: $black;
  }

  &.hvr-underline-from-left::before,
  &.hvr-underline-from-right::before,
  &.hvr-overline-from-left::before,
  &.hvr-overline-from-right::before {
    height: 1px;
  }
}
</style>
