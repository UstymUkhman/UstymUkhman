<template>
  <li :class="{'active': active, 'visible': visible}" itemprop="item">
    <pre :class="{'dissolve': dissolve}">{{ cursor }}</pre>
    <p itemprop="name">{{ page }}</p>
    <em v-if="mail"> - ustym.ukhman@gmail.com</em>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExternalLink',

  props: {
    page: {
      required: true,
      type: String
    },

    cursor: {
      required: true,
      type: String
    },

    dissolve: {
      required: false,
      default: false,
      type: Boolean
    },

    visible: {
      required: false,
      default: false,
      type: Boolean
    },

    active: {
      required: false,
      default: false,
      type: Boolean
    },

    mail: {
      required: false,
      default: false,
      type: Boolean
    }
  }
})
</script>

<style lang="scss" scoped>
li {
  visibility: hidden;
  position: relative;

  display: block;
  margin: 14vh 0;

  &.visible {
    visibility: visible;
  }

  @media only screen and (max-height: 550px) {
    margin: 12vh 0;
  }

  p,
  pre {
    @include white-rabbit;
    display: inline-block;
    font-size: 25px;

    @include breakpoint($xs) {
      font-size: 18px;
    }
  }

  pre {
    transition: opacity 0.2s $ease-in-out-cubic;
    visibility: hidden;
    opacity: 0;
  }

  p {
    transition: transform 0.4s $ease-out-quart;
    line-height: 20px;

    @include breakpoint($xs) {
      line-height: 18px;
    }
  }

  em {
    transition: transform 0.4s $ease-out-quart, opacity 0.3s;
    @include size(auto, 25px);
    margin: auto 0 auto 10px;
    @include white-rabbit;

    white-space: nowrap;
    visibility: visible;
    position: absolute;

    color: $fade-green;
    line-height: 25px;
    font-size: 25px;

    opacity: 0;
    bottom: 0;
    top: 0;

    @include breakpoint($sm-down) {
      line-height: 25px;
      margin-top: 5px;
    }

    @include breakpoint($xs) {
      font-size: 13px;
      margin-left: 0;
      margin-top: 0;
    }
  }

  &.active {
    pre {
      visibility: visible;
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
