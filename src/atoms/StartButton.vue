<template>
  <div class="start-button">
    <ScreenOverlay class="button-overlay" />

    <div class="start-button-container">
      <div class="button-border">
        <div class="button-box" :class="{'active': active, 'pressed': pressed, 'selected': selected}">

          <div class="button-background"></div>
          <p ref="start" class="button start">5t@rt</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScreenOverlay from '@/atoms/ScreenOverlay'
import Lettering from '@/utils/Lettering'

export default {
  name: 'StartButton',

  components: {
    ScreenOverlay
  },

  data () {
    return {
      selected: false,
      pressed: false,
      active: false
    }
  },

  methods: {
    onPress (event) {
      if (event.which === 1 || event.keyCode === 13) {
        this.selected = true
        this.pressed = true
      }
    },

    onRelease (event) {
      if (event.which === 1 || event.keyCode === 13) {
        this.removeEventListeners()
        this.lettering.dispose()

        this.selected = false
        this.pressed = false
        this.active = false

        setTimeout(() => {
          this.$emit('click:start', event)
        }, 2500)
      }
    },

    addEventListeners () {
      this._onPress = this.onPress.bind(this)
      this._onRelease = this.onRelease.bind(this)

      document.addEventListener('keyup', this._onRelease, false)
      document.addEventListener('keydown', this._onPress, false)

      this.$refs.start.addEventListener('mouseup', this._onRelease, false)
      this.$refs.start.addEventListener('mousedown', this._onPress, false)
    },

    removeEventListeners () {
      document.removeEventListener('keyup', this._onRelease, false)
      document.removeEventListener('keydown', this._onPress, false)

      document.removeEventListener('mouseup', this._onRelease, false)
      document.removeEventListener('mousedown', this._onPress, false)
    }
  },

  mounted () {
    this.lettering = new Lettering()
    this.lettering.animate(this.$refs.start, 100, () => {
      this.addEventListeners()
      this.active = true
    })
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.start-button {
  position: absolute;
  overflow: hidden;

  z-index: $code;
  margin: auto;

  height: 50px;
  width: 150px;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .button-overlay {
    pointer-events: none;
  }

  .start-button-container {
    @include console-button;

    position: absolute;
    margin: 0 auto;

    height: 50px;
    width: 150px;

    bottom: 0;
    right: 0;
    left: 0;

    .button-box {
      width: 150px;
    }

    .button-background {
      height: 50px;
      width: 150px;
    }

    .button.start {
      font-family: 'White Rabbit';
      line-height: 50px;
      font-size: 25px;
      color: $green;
    }
  }
}
</style>
