<template>
  <li :class="{'active': active, 'visible': visible}" itemscope>
    <pre :class="{'dissolve': dissolve}">{{ cursor }}</pre>
    <p itemprop="name">{{ link }}</p>
    <em v-if="mail" itemprop="email"> - ustym.ukhman@gmail.com</em>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExternalLink',

  props: {
    link: {
      type: String,
      required: true
    },

    cursor: {
      type: String,
      required: true
    },

    dissolve: {
      type: Boolean,
      default: false,
      required: false
    },

    visible: {
      type: Boolean,
      default: false,
      required: false
    },

    active: {
      type: Boolean,
      default: false,
      required: false
    },

    mail: {
      type: Boolean,
      default: false,
      required: false
    }
  }
})
</script>

<style lang="scss" scoped>
li {
  @include vh(margin, 14, 0);
  visibility: hidden;

  position: relative;
  display: block;

  &.visible {
    visibility: visible;
  }

  @media only screen and (max-height: 550px) {
    @include vh(margin, 12, 0);
  }

  p,
  em,
  pre {
    @include white-rabbit;
    display: inline-block;

    line-height: 25px;
    font-size: 25px;

    @include breakpoint($xs) {
      line-height: 18px;
      font-size: 18px;
    }
  }

  pre {
    transition: opacity 0.2s $ease-in-out-cubic;
    backface-visibility: hidden;

    color: $energy-green;
    visibility: visible;

    opacity: 0;
    margin: 0;
  }

  p {
    transition: transform 0.4s $ease-out-quart;
  }

  em {
    transition: transform 0.4s $ease-out-quart, opacity 0.3s;
    backface-visibility: hidden;
    @include size(auto, 25px);

    margin: auto 0 auto 10px;
    white-space: nowrap;

    position: absolute;
    color: $fade-green;

    opacity: 0;
    bottom: 0;
    top: 0;

    @include breakpoint($xs) {
      line-height: 18px;
      font-size: 13px;

      margin: auto 0;
      height: 18px;
    }
  }

  &.active {
    pre {
      opacity: 1;

      &.dissolve {
        transition-duration: 0.5s;
        transition-delay: 0.5s;
        opacity: 0;
      }
    }

    p {
      transform: translateX(25px);
      position: relative;
      color: $fade-green;

      @include breakpoint($sm-down) {
        transform: translateX(20px);
      }

      @include breakpoint($xs) {
        transform: translateX(15px);
      }
    }

    em {
      transform: translateX(25px);
      transition-delay: 0.1s;
      opacity: 1;

      @include breakpoint($xs) {
        transform: translateX(20px);
      }
    }
  }
}
</style>
