<template>
  <transition appear name="footer">
    <footer class="footer" :class="{'scrollable': scroll}">
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
    </footer>
  </transition>
</template>

<script>
import WebsitePage from '@/assets/svg/website.svg'
import ExperimentsPage from '@/assets/svg/experiments.svg'
import FacebookShare from '@/assets/svg/facebook.svg'
import TwitterShare from '@/assets/svg/twitter.svg'
import Loading from '@/services/Loading'

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
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'z-index';

.footer {
  background-color: rgba($black, 0.9);
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
  transition: stroke 0.5s;
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
    fill: $gray;
  }

  &.twitter,
  &.facebook {
    /deep/ .path {
      transition: fill 0.5s;
      fill: $gray;
    }
  }

  &:hover {
    &.website,
    &.experiments {
      fill: $white;
    }

    &.twitter,
    &.facebook {
      /deep/ .path {
        fill: $white;
      }
    }
  }
}

.footer-enter,
.footer-leave-to {
  transform: translateY(100%);
}

.footer-enter-active,
.footer-leave-active {
  transition: transform 0.5s ease-out 0.5s;
}
</style>
