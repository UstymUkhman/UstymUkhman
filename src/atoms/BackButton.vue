<template>
  <div class="back-button">
    <transition appear name="fade-out">
      <div @touchend="onTouchend" class="back-button-container">
        <div class="button-border">
          <div class="button-box" :class="{'active': isActive, 'selected': backToMenu}">

            <div class="button-background"></div>
            <p ref="back" class="button back" :class="{'active': isActive}">&lt; b@cK</p>

          </div>
        </div>
      </div>
    </transition>

    <!-- <MatrixCode :run="backToMenu" /> -->
  </div>
</template>

<script>
// import MatrixCode from '@/molecules/MatrixCode'
import Lettering from '@/utils/Lettering'
import Loading from '@/utils/Loading'

export default {
  name: 'BackButton',

  // components: {
  //   MatrixCode
  // },

  props: {
    active: {
      type: Boolean,
      default: false,
      required: false
    },

    backToMenu: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      isActive: this.active
    }
  },

  watch: {
    active (now) {
      this.isActive = now
    },

    backToMenu (back) {
      if (back) {
        setTimeout(() => {
          Loading.checkActiveItem()
          this.$router.push({name: 'SiteMenu'})
        }, 2500)
      }
    }
  },

  methods: {
    onTouchend () {
      let delay = null

      if (!this.active) {
        this.isActive = true
        delay = 800
      }

      setTimeout(() => {
        this.$emit('update:backToMenu', true)
      }, delay)
    }
  },

  mounted () {
    new Lettering().animate(this.$refs.back, 100)
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.back-button {
  pointer-events: none;
  position: absolute;
  overflow: hidden;
  margin: auto;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .back-button-container {
    @include console-button;
    @include back-button;

    margin: 0 auto 25px;
    position: absolute;

    height: 50px;
    width: 150px;

    bottom: 0;
    right: 0;
    left: 0;

    @media only screen and (max-height: 550px) {
      margin-bottom: 10px;
    }

    @include breakpoint($sm-down) {
      pointer-events: all;
      position: fixed;
      cursor: pointer;

      height: 40px;
      width: 120px;
    }

    @include breakpoint($xs) {
      @include console-button(2px);
    }

    .button-box {
      width: 150px;

      @include breakpoint($sm-down) {
        width: 100%;
      }
    }

    .button-background {
      height: 50px;
      width: 150px;

      @include breakpoint($sm-down) {
        height: 100%;
        width: 100%;
      }
    }

    .button.back {
      font-family: 'White Rabbit';
      padding: 0 10% 0 30%;

      line-height: 50px;
      font-size: 25px;
      color: $green;

      @include breakpoint($sm-down) {
        padding-left: 25%;
        line-height: 42px;
        font-size: 20px;
      }
    }
  }
}
</style>
