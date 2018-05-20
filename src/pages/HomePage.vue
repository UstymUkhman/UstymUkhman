<template>
  <article class="home-page">
    <h1 v-translate translate-comment="The homepage text title">Welcome to the MONOGRID Vue.js Boilerplate</h1>
    <p v-translate translate-comment="In the homepage">This is an inline SVG Icon</p>
    <HomeIcon class="home-icon-svg"></HomeIcon>
    <p v-translate translate-comment="In the homepage">These are some Spritesheet Icons</p>
    <div class="example-icon home-icon-spritesheet"></div>
    <div class="example-icon twitter-icon-spritesheet"></div>
    <div class="example-icon facebook-icon-spritesheet"></div>
    <MarkdownBlock class="homepage-complex-translation" tag="div" :inline="false" :text="complexTranslation" />
    <PlatformInfo class="platform-info-table" />
  </article>
</template>

<script>
import HomeIcon from '@/assets/img/home.svg'
import MarkdownBlock from '@/atoms/MarkdownBlock'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import PlatformInfo from '@/molecules/PlatformInfo'

export default {
  name: 'Home',

  mixins: [FirePrerenderEvent],

  components: {
    HomeIcon,
    MarkdownBlock,
    PlatformInfo
  },

  computed: {
    complexTranslation: function () {
      // this is an example of a complex translation that implements strong tags / router links / lists etc

      // comment for translator: in homepage
      return this.$gettext('Please feel free to\n\n- ~~stress [Daniele](mailto:daniele@mono-grid.com)~~\n- **explore our [Example Service](Service) page**\n- [Switch Language](Home "language: \'it\'") to Italian')
    }
  },

  metaInfo: function () {
    return {
      // home page browser title
      title: this.$gettext('Home Page')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'sprite';
@import 'mixins';

.home-page {
  text-align: center;
  padding: 1rem;
}

p {
  margin: 1rem;
}

.platform-info-table {
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}

.home-icon-svg {
  width: 100px;
  height: 100px;
  /deep/ path {
    stroke: $c-white;
    fill: $c-white;
  }
}

.example-icon {
  margin: 1rem;
}

.home-icon-spritesheet {
  @include sprite($home);
  display: inline-block;
}
.twitter-icon-spritesheet {
  @include sprite($twitter);
  display: inline-block;
}
.facebook-icon-spritesheet {
  @include sprite($facebook);
  display: inline-block;
}

.homepage-complex-translation {
  max-width: 300px;
  margin: 0 auto;
  text-align: left;

  a {
    text-decoration: underline;
    transition: color 0.5s;
    color: $c-aqua;
    &:hover {
      color: $c-navy;
    }
  }

  ul,
  ol {
    margin: 1rem;
    list-style: initial;
  }
}
</style>
