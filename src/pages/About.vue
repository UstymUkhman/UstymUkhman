<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="about-me-page">
    <p ref="text" itemprop="text" class="about-description">
      {{ aboutDescription }}
    </p>

    <BackButton
      v-if="showBackButton"
      :active="activeBackButton"
      :selected="selectedBackButton"
    />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import BackButton from '@/atoms/BackButton'
import Lettering from '@/utils/Lettering'
import Platform from '@/platform'

export default {
  name: 'About',

  mixins: [FirePrerenderEvent],

  components: {
    BackButton
  },

  data () {
    return {
      selectedBackButton: false,
      activeBackButton: false,
      showBackButton: false,

      aboutDescription: `
        Hi, my name is Ustym and I'm a front-end web developer at MONOGRID.#
        I was born and raised in Zbarazh (Ucraine), however I live in Florence (Italy) for ${this.years} years so far.##

        Things I love:#
        %- Learning and using innovative web technologies#
        %- JavaScript in (almost) all its forms#
        %- CSS3 (and SCSS preprocessor)#
        %- Cat Videos, Music, Films & Coffee##

        Things I hate:#
        %- Internet Explorer#
        %- Social Networks#
        %- Dirty code#
        %- Mondays#
      `
    }
  },

  computed: {
    years () {
      const today = new Date()
      const arrive = today.getMonth() > 7 ? 2005 : 2006

      return today.getFullYear() - arrive
    }
  },

  methods: {
    showMessage () {
      this.lettering.animate(this.$refs.text, 50, () => {
        this.showBackButton = true

        setTimeout(() => {
          this.activeBackButton = true
        }, 1000)
      })
    },

    onKeyDown (event) {
      const enterKey = Platform.mobile || event.keyCode === 13

      if (this.activeBackButton && enterKey) {
        this.selectedBackButton = true
      } else if (!this.showBackButton) {
        this.lettering.skipLettering()
      }
    },

    onKeyUp (event) {
      const enterKey = Platform.mobile || event.keyCode === 13

      if (this.activeBackButton && enterKey) {
        this.selectedBackButton = false
        this.lettering.dispose()
      }
    }
  },

  mounted () {
    this._onKeyUp = this.onKeyUp.bind(this)
    this._onKeyDown = this.onKeyDown.bind(this)

    document.addEventListener('keyup', this._onKeyUp, false)
    document.addEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.addEventListener('touchend', this._onKeyUp)
      document.addEventListener('touchstart', this._onKeyDown)
    }

    this.lettering = new Lettering()
    this.showMessage()
  },

  beforeDestroy () {
    document.removeEventListener('keyup', this._onKeyUp, false)
    document.removeEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.removeEventListener('touchend', this._onKeyUp)
      document.removeEventListener('touchstart', this._onKeyDown)
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
  background-color: rgba($black, 0.8);

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

  @include breakpoint($md-down) {
    background-color: initial;
  }

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
      margin-top: 0;
    }
  }
}
</style>
