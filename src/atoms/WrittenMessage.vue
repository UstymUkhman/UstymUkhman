<template>
  <div class="written-message">
    <p ref="message" v-html="messageList[currentIndex]" class="message-text" :class="{'dissolve': dissolve}"></p>
  </div>
</template>

<script>
import Lettering from '@/utils/Lettering'
import Platform from '@/platform'

export default {
  name: 'WrittenMessage',

  data () {
    return {
      stopLettering: false,
      currentIndex: -1,
      dissolve: false,

      messageList: [
        'Hello my friend.',
        'I\'m glad to see you here.',
        'Follow your instincts...'
      ]
    }
  },

  methods: {
    prepareMessage () {
      if (this.stopLettering) {
        return
      }

      if (this.messageList[++this.currentIndex]) {
        this.showTimeout = setTimeout(this.showMessage.bind(this), 1500)
      } else if (this.currentIndex === this.messageList.length) {
        this.currentIndex--
      }
    },

    showMessage () {
      this.lettering.animate(this.$refs.message, 150, this.prepareMessage.bind(this), 1500)
    },

    removeMessage () {
      document.removeEventListener('keydown', this._onKeyDown, false)

      if (Platform.mobile) {
        document.removeEventListener('touchend', this._onKeyDown)
      }

      setTimeout(() => { this.dissolve = true }, 100)
      setTimeout(() => { this.$emit('ready:console') }, 2600)
    },

    onKeyDown () {
      this.stopLettering = true
      this.lettering.skipLettering()

      clearTimeout(this.showTimeout)
      setTimeout(this.removeMessage.bind(this))
    }
  },

  mounted () {
    this.lettering = new Lettering()
    this.prepareMessage()

    this._onKeyDown = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.addEventListener('touchend', this._onKeyDown)
    }
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this._onKeyDown, false)

    if (Platform.mobile) {
      document.removeEventListener('touchend', this._onKeyDown)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.written-message {
  visibility: hidden;
  position: relative;

  display: block;
  z-index: 3;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .message-text {
    @include white-rabbit;

    backface-visibility: hidden;
    position: absolute;

    @include breakpoint($sm-down) {
      font-size: 14px;
    }
  }
}
</style>
