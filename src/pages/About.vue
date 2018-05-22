<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="about-me-page">
    <transition appear name="description">
      <p v-if="!goToMenu" ref="text" itemprop="text" class="about-description">
        {{ aboutDescription }}
      </p>
    </transition>

    <BackButton
      v-if="showBackButton"
      :active="activeBackButton"
      :backToMenu.sync="goToMenu"
    />
  </article>
</template>

<script>
import BackButton from '@/atoms/BackButton'
import Lettering from '@/utils/Lettering'
import Platform from '@/platform'

export default {
  name: 'About',

  components: {
    BackButton
  },

  data () {
    return {
      activeBackButton: false,
      showBackButton: false,
      goToMenu: false,

      aboutDescription: `
        Hi, my name is Ustym and I'm a front-end web developer at MONOGRID.#
        I was born and raised in Zbarazh (Ucraine), however I live in Florence (Italy) for ${this.getYears()} years so far.##

        Things I love:#
        %- Learning and using innovative web technologies#
        %- JavaScript in (almost) all its forms#
        %- CSS3 (and SCSS preprocessor)#
        %- Music, Films & Coffee##

        Things I hate:#
        %- Social Networks#
        %- Dirty code#
        %- Mondays#
      `
    }
  },

  methods: {
    getYears () {
      const today = new Date()
      const arrive = today.getMonth() > 7 ? 2005 : 2006

      return today.getFullYear() - arrive
    },

    showMessage () {
      this.lettering.animate(this.$refs.text, 50, () => {
        this.showBackButton = true

        setTimeout(() => {
          this.activeBackButton = true
        }, 1000)
      })
    },

    onKeyDown (event) {
      if (this.activeBackButton && event.keyCode === 13) {
        this.removeAboutMeSection()
      } else if (!this.showBackButton) {
        // this.$ua.trackEvent('AboutMe', 'Skipped', 'Yes')
        this.lettering.skipLettering()
      }
    },

    removeAboutMeSection () {
      document.removeEventListener('keydown', this._onKeyDown, false)
      this.goToMenu = true

      if (Platform.mobile) {
        document.removeEventListener('touchend', this._onKeyDown)
      }
    }
  },

  mounted () {
    this._onKeyDown = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.addEventListener('touchend', this._onKeyDown)
    }

    this.lettering = new Lettering()
    this.showMessage()
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.removeEventListener('touchend', this._onKeyDown)
    }
  },

  metaInfo: {
    title: 'About |'
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.about-me-page {
  background-color: $black;
  position: absolute;
  overflow: hidden;

  display: block;
  z-index: 3;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .about-description {
    @include white-rabbit;
    position: absolute;

    line-height: 28px;
    margin: auto;

    height: 395px;
    width: 1050px;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    &.description-leave-active {
      transition: opacity 1s linear 3.5s;
    }

    &.description-leave-to {
      opacity: 0;
    }

    @include breakpoint($md-down) {
      width: 900px;
    }

    @include breakpoint($sm-down) {
      line-height: 20px;
      font-size: 13px;

      height: 360px;
      width: 75vw;
    }

    @include breakpoint($xs) {
      margin-top: 15vh;
      width: 95vw;
    }

    @media only screen and (max-height: 550px) {
      margin-top: 5vh;
    }
  }
}
</style>
