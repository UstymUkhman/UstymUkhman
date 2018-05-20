<template>
  <div
    id="app"
    v-show="!platform.prerenderer && isReady"
    :version="version"
    :commit-hash="commitHash"
    :deploy-flag="deployFlag"
    :target-domain="targetDomain"
    >
    <SiteHeader />
    <transition name="pages">
      <router-view class="page" v-if="isReady" />
    </transition>
    <SiteFooter />
    <VersionInfo :version="version" v-if="!deployFlag" :commit-hash="commitHash" />
  </div>
</template>

<script>
import VersionInfo from '@/atoms/VersionInfo.vue'
import SiteHeader from '@/organisms/SiteHeader'
import SiteFooter from '@/organisms/SiteFooter'
import Platform from '@/platform'

export default {
  name: 'App',

  components: {
    VersionInfo,
    SiteHeader,
    SiteFooter
  },

  props: {
    // version string of this specific build
    version: {
      type: String,
      required: true
    },
    // commit hash of this specific build
    commitHash: {
      type: String,
      required: true
    },
    // this is the domain where the site will stay
    // it varies from build to build so the site can be built to be hosted
    // on various domains
    // it can be set by using
    // npm run build --domain="http://www.example.com"
    targetDomain: {
      type: String,
      required: true
    },
    // this is a flag set to true
    // by the build system (or if you build the site with --deploy)
    // use this to enable debug stuff that needs to be hidden in the deploy version
    deployFlag: {
      type: Boolean,
      required: true
    },
    // the preloader instance used by the root app
    // set preloader.visible to show it / hide it
    preloader: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      // this flag is used to show the app once the preloading
      // (if present) is finished
      isReady: false,
      // platform, accessible with an import statement
      // or by using this.$root.platform
      // NOTE: import statement is preferred
      platform: Platform
    }
  },

  mounted: function () {
    // set this.isReady = true
    // when all stuff that needs to be loaded for the app is loaded
    // if you need to preload stuff, delete this line and set to true later
    this.isReady = true
  },

  watch: {
    isReady: function (value) {
      // hide / show preloader
      this.preloader.visible = !value
    }
  },

  metaInfo: function () {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: ' ',
      // all titles will be injected into this template
      titleTemplate: '%s | ' + this.$gettext('MONOGRID'),
      base: { href: '/' },
      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'fragment', content: '!' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'msapplication-TileColor', content: '#100E17' },
        { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
        { name: 'theme-color', content: '#100E17' },
        // twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@monogridstudio' },
        { name: 'twitter:creator', content: '@monogridstudio' },
        // generic description
        { vmid: 'description', name: 'description', content: this.$gettext('A Vue.js Boilerplate buit and mantained by MONOGRID') },
        // og tags
        { vmid: 'ogtype', property: 'og:type', content: 'website' },
        { vmid: 'ogurl', property: 'og:url', content: this.targetDomain + this.$route.fullPath + '/' },
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'MONOGRID Digital & VR Creative Studio' },
        { vmid: 'ogdescription', property: 'og:description', content: this.$gettext('A Vue.js Boilerplate buit and mantained by MONOGRID') },
        { vmid: 'ogimage', property: 'og:image', content: this.targetDomain + '/static/img/share.jpg' }
      ],
      htmlAttrs: {
        lang: this.$language.current
      }
    }
  }
}
</script>

<style lang="scss">

// either use this (to normalize css)
// @import '~normalize-scss';
// or this (to reset css)
@import '~node-reset-scss/scss/reset';
// IMPORTANT: don't import both

@import 'breakpoints';
@import 'app-colors';
@import 'easings';
@import 'fonts';
@import 'mixins';
@import 'sprite';
@import 'z-index';

//
//
// Default app CSS layout
// NOTE: please change this to fit your needs
//
//
html {
  height: 100%;
  font-family: 'Lato', 'Open Sans', sans-serif;
  font-weight: 300;
  color: $c-white;
  background-color: $c-blue;
  overflow: auto;
  overflow-x: hidden;
}

.page {
  padding-bottom: 70px !important;
  padding-top: 70px !important;
  z-index: $z-content;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
}

//
//
// Default styles
// NOTE: delete these and re-write them in your app
//
//
h1 {
  font-weight: 700;
  font-size: 3rem;
  margin: 1rem;

  @include breakpoint($xs) {
    font-size: 2rem;
  }
}

h2 {
  font-weight: 400;
  font-size: 2rem;
  margin: 0.5rem;

  @include breakpoint($xs) {
    font-size: 1.5rem;
  }
}

p {
  margin: 0.5rem;
}

a {
  color: $c-white;
  text-decoration: none;

  &:hover {
    color: $c-blue;
  }
}

strong,
em {
  font-weight: 600;
}

button,
input,
select {
  border: 0;
  padding: 0.2rem;
  background-color: $c-white;
}

//
//
// this is the default transition
// when a component is enclosed in a <transition> tab with no "name" specified
// this is the transition which is triggered by default
//
//
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

//
//
// this is the page to page transition
//
//
.pages-enter-active,
.pages-leave-active {
  transition: transform 0.5s $ease-in-out-cubic;
  // position: absolute;
}

.pages-enter {
  transform: translateX(100%);
}
.pages-leave-to {
  transform: translateX(-100%);
}
</style>
