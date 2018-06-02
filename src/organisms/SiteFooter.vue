<template>
  <footer @mouseover="visible = true" @mouseout="visible = false" class="footer" :class="{'scrollable': scroll}">

    <transition appear name="footer">
      <div v-show="visible" class="footer-container">
        <div class="page-links buttons">
          <WebsitePage @click.native="onWebsiteClick" class="website" />

          <router-link title="Experiments" :to="{name: 'Experiments'}">
            <ExperimentsPage class="experiments" />
          </router-link>
        </div>

        <div class="social-share buttons">
          <FacebookShare @click.native="facebookShare" class="facebook" />
          <TwitterShare @click.native="twitterShare" class="twitter" />
        </div>
      </div>
    </transition>

    <div class="footer-trigger" :class="{'hidden': visible}"></div>
  </footer>
</template>

<script>
import ExperimentsPage from '@/assets/svg/experiments.svg'
import FacebookShare from '@/assets/svg/facebook.svg'
import TwitterShare from '@/assets/svg/twitter.svg'
import WebsitePage from '@/assets/svg/website.svg'

import Loading from '@/utils/Loading'
import Platform from '@/platform'

export default {
  name: 'SiteFooter',

  components: {
    WebsitePage,
    ExperimentsPage,
    FacebookShare,
    TwitterShare
  },

  props: {
    scroll: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      visible: !Platform.mobile
    }
  },

  methods: {
    onWebsiteClick () {
      Loading.checkActiveItem()
      this.$router.push({name: 'Console'})
    },

    facebookShare () {
      const url = `https://facebook.com/sharer.php?u=${encodeURIComponent(window.location)}`
      window.open(url, '_blank', 'width=640,height=400,status=no,toolbar=no,titlebar=no')
    },

    twitterShare () {
      const description = document.querySelector('meta[name="twitter:description"]').getAttribute('content')
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location)}&text=${description}`
      window.open(url, '_blank', 'width=640,height=400,status=no,toolbar=no,titlebar=no')
    }
  },

  mounted () {
    setTimeout(() => { this.visible = !this.visible }, 2500)
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';
@import 'z-index';
@import 'easings';

.footer {
  position: fixed;
  z-index: $top;

  line-height: 25px;
  height: 25px;
  width: 100%;

  bottom: 0;
  left: 0;

  &.scrollable {
    width: calc(100% - 5px);
  }

  .footer-container {
    background-color: rgba($black, 0.9);
    height: 100%;
    width: 100%;
  }

  .footer-trigger {
    position: absolute;
    height: 100%;
    width: 100%;

    &.hidden {
      pointer-events: none;
    }

    @include breakpoint($sm-down) {
      display: none;
    }
  }

  .buttons {
    position: absolute;
    height: 100%;
    width: 100px;

    &.page-links {
      text-align: left;
      left: 0;
    }

    &.social-share {
      text-align: right;
      right: 0;
    }
  }
}

svg {
  position: absolute;
  cursor: pointer;
  width: 18px;

  &.website {
    height: 22px;
    width: 21px;

    left: 25px;
    top: 2px;
  }

  &.experiments {
    width: 20px;
    left: 55px;
    top: 3px;
  }

  &.facebook {
    height: 17px;
    right: 55px;
    top: 4px;
  }

  &.twitter {
    height: 20px;
    right: 25px;
    top: 3px;
  }

  &.website,
  &.experiments {
    transition: fill 0.5s;
    fill: $dark-green;
  }

  &.twitter,
  &.facebook {
    /deep/ .path {
      transition: fill 0.5s;
      fill: $dark-green;
    }
  }

  &:hover {
    &.website,
    &.experiments {
      fill: $green;
    }

    &.twitter,
    &.facebook {
      /deep/ .path {
        fill: $green;
      }
    }
  }
}

.footer-enter-active {
  transition: transform 0.5s $ease-out-quad;
}

.footer-leave-active {
  transition: transform 0.5s $ease-in-quad;
}

.footer-enter,
.footer-leave-to {
  transform: translateY(100%);
}
</style>
