<template>
  <div id="app" v-show="!platform.prerenderer" :version="version" :commit-hash="commitHash" :deploy-flag="deployFlag" :target-domain="targetDomain">

    <transition appear>
      <router-view itemprop="mainEntity" class="page" />
    </transition>

    <VersionInfo :version="version" v-if="!deployFlag" :commit-hash="commitHash" />
  </div>
</template>

<script>
import VersionInfo from '@/atoms/VersionInfo'
import Platform from '@/platform'

export default {
  name: 'App',

  components: {
    VersionInfo
  },

  props: {
    version: {
      type: String,
      required: true
    },

    commitHash: {
      type: String,
      required: true
    },

    targetDomain: {
      type: String,
      required: true
    },

    deployFlag: {
      type: Boolean,
      required: true
    },

    preloader: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      platform: Platform
    }
  },

  mounted () {
    console.log('%cCoffee is never too much.', 'background:#000; padding: 5px; color: #0C0;')
  },

  metaInfo () {
    return {
      base: { href: '/' },
      title: 'Ustym Ukhman',
      titleTemplate: '%s Ustym Ukhman',

      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'fragment', content: '!' },

        { name: 'theme-color', content: '#000000' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },

        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'msapplication-TileColor', content: '#000000' },
        { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },

        { name: 'twitter:site', content: '@ustymukhman' },
        { name: 'twitter:creator', content: '@ustymukhman' },

        { vmid: 'twittertitle', name: 'twitter:title', content: 'Ustym Ukhman' },
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Ustym Ukhman' },

        { vmid: 'description', name: 'description', content: '' },
        { vmid: 'ogdescription', property: 'og:description', content: '' },
        { vmid: 'twitterdescription', name: 'twitter:description', content: '' },

        { vmid: 'ogtype', property: 'og:type', content: 'website' },
        { vmid: 'twittercard', name: 'twitter:card', content: 'summary_large_image' },

        { vmid: 'ogurl', property: 'og:url', content: `${window.location.origin}${this.$route.fullPath}` },
        { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/subject.jpg` },
        { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/subject.jpg` }
      ],

      htmlAttrs: {
        lang: 'en'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';
@import 'z-index';
@import 'mixins';
@import 'fonts';

html {
  font-family: 'Roboto', 'Open Sans', sans-serif;
  font-weight: 400;

  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-touch-callout: none;

  background-color: $black;
  appearance: none;
  color: $green;

  text-size-adjust: none;
  user-select: none;
  // cursor: none;

  // overflow-x: hidden;
  // overflow-y: auto;
  overflow: hidden;

  max-height: 100%;
  min-height: 100%;

  max-width: 100%;
  min-width: 100%;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;
}

.app-container {
  height: 100%;

  .background-video {
    position: fixed;

    @include breakpoint($sm-down) {
      display: none;
    }
  }
}

.page {
  box-sizing: border-box;
  position: absolute;

  height: 100%;
  width: 100%;

  left: 0;
  top: 0;
}

.sound-particles-page canvas {
  position: absolute;
  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}

h1 {
  font-weight: 700;
  font-size: 48px;
  cursor: default;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 32px;
  }
}

h2 {
  font-weight: 400;
  font-size: 32px;
  cursor: default;
  margin: 0px;

  @include breakpoint($xs) {
    font-size: 25px;
  }
}

p {
  @include console-message;
  @include back-button;

  @include rain-column;
  @include code-column;

  cursor: default;
  margin: 0px;
}

span {
  &.function {
    color: #66d9ef;
  }

  &.string {
    color: #e6db74;
  }

  &.number {
    color: #ae81ff;
  }
}

a {
  text-decoration: none;
  cursor: pointer;
  color: $white;

  &:hover {
    color: $blue;
  }
}

em,
strong {
  font-weight: 600;
}

input,
button,
select {
  background-color: $white;
  padding: 4px;
  border: 0;
}

canvas {
  position: absolute;
  z-index: $pills;

  left: 0;
  top: 0;
}

br::selection {
  background-color: $silver;
  color: $black;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.fade-out-leave-active {
  transition: opacity 1s !important;
}

.fade-out-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  background-color: $black;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  transition: background-color 0.5s;
  background-color: $silver;
}

::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:active {
  background-color: $white;
}
</style>