<template>
  <section itemtype="http://schema.org/Menu" itemscope class="menu-section">
    <div class="menu-items">
      <div v-for="(page, p) in pages" :key="p" class="button-border">

        <div ref="items" class="button-box" itemtype="https://schema.org/MenuItem"
             @touchstart.once="onTouchStart(p)" @touchend.once="onTouchEnd"
             :class="{
               'active': (p === currentItem && !nextPage) || visibleButtons.includes(p),
               'selected': p === settedSection && !nextPage,
               'visible': skipLettering,
               'pressed': pressed
             }">

          <div class="button-background"></div>
          <p itemprop="name" class="button">{{ page }}</p>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import Lettering from '@/utils/Lettering'
import Loading from '@/utils/Loading'
import Platform from '@/platform'

export default {
  name: 'SiteMenu',

  data () {
    return {
      skipLettering: false,
      settedSection: null,
      currentItem: null,
      nextPage: false,
      pressed: false,

      visibleButtons: [],
      typingTimeout: 500,
      itemIndex: -1,
      words: [],

      pages: [
        'Ab0uT_m3',
        'My_W0rk5',
        'C0nT@cT_m3'
      ]
    }
  },

  methods: {
    skipMenuLettering () {
      if (this.lettering) {
        this.lettering.skipLettering()
        this.skipLettering = true
        this.typingTimeout = 0

        if (Platform.mobile) {
          this.visibleButtons = [0, 1, 2]
        }
      }
    },

    showMenuItems () {
      if (++this.itemIndex < this.pages.length) {
        this.lettering = new Lettering()

        this.words.push(
          this.lettering.animate(
            this.items[this.itemIndex].children[1],
            50, this.showMenuItems.bind(this), this.typingTimeout
          )
        )

        if (this.skipLettering) {
          this.lettering.skipLettering()
        } else if (Platform.mobile) {
          setTimeout(() => {
            this.visibleButtons.push(this.itemIndex)
          }, this.typingTimeout)
        }
      } else if (this.currentItem === null) {
        this.currentItem = Platform.mobile ? null : Loading.getActiveItem() || 0
        this.toggleKeyListeners()
      }
    },

    onKeyDown ($event) {
      if ($event.keyCode === 13 && !this.pressed) {
        this.settedSection = this.currentItem
        this.pressed = true
      }
    },

    onKeyUp ($event) {
      const code = $event.keyCode
      const item = this.currentItem

      if ($event.keyCode === 13) {
        this.setMenuSection()
      } else if (code === 38) {
        this.currentItem = !item ? this.visibleItems : item - 1
      } else if (code === 40) {
        this.currentItem = (item === this.visibleItems) ? 0 : item + 1
      }
    },

    onTouchStart (index) {
      if (this.visibleButtons.length < 3) {
        return
      }

      this.currentItem = index
      this.onKeyDown({ keyCode: 13 })
    },

    onTouchEnd () {
      if (this.visibleButtons.length < 3) {
        return
      }

      this.onKeyUp({ keyCode: 13 })
      this.visibleButtons = []
    },

    setMenuSection () {
      const nextSection = this.settedSection
      const visibleRain = nextSection > 0 && nextSection < 3

      this.pressed = false
      this.nextPage = true
      this.settedSection = null

      this.removeKeyListeners()
      this.lettering.disposeAll(this.words)
      this.$emit('toggle:rain', visibleRain)

      setTimeout(() => {
        this.settedSection = nextSection

        this.$router.push({
          name: Loading.getPageName(this.settedSection)
        })
      }, 2500)
    },

    toggleKeyListeners () {
      document.removeEventListener('keyup', this._skipMenuLettering, false)
      document.removeEventListener('touchend', this._skipMenuLettering, false)

      if (!Platform.mobile) {
        setTimeout(() => {
          this._onKeyUp = this.onKeyUp.bind(this)
          this._onKeyDown = this.onKeyDown.bind(this)
          this.visibleItems = this.items.length - 1

          document.addEventListener('keyup', this._onKeyUp, false)
          document.addEventListener('keydown', this._onKeyDown, false)
        }, 100)
      }
    },

    removeKeyListeners () {
      document.removeEventListener('keyup', this._onKeyUp, false)
      document.removeEventListener('keydown', this._onKeyDown, false)
    }
  },

  mounted () {
    this._skipMenuLettering = this.skipMenuLettering.bind(this)
    document.addEventListener('keyup', this._skipMenuLettering, false)

    if (Platform.mobile) {
      document.addEventListener('touchend', this._skipMenuLettering)
    }

    if (!Platform.isIE && !Platform.mobile) {
      this.pages.push('M0r3')
    }

    setTimeout(() => {
      this.$emit('toggle:rain', true)
      this.items = this.$refs.items
      this.showMenuItems()
    }, 500)
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.menu-section {
  position: absolute;
  z-index: $menu;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .menu-items {
    @include console-button(5px);
    margin-left: 100px;
    height: 100%;

    .isie & {
      transform: translateY(-50%);
      position: absolute;
      height: auto;
      top: 50%;
    }

    @include breakpoint($md-down) {
      margin-left: 0;
    }

    @include breakpoint($sm-down) {
      transform: translateY(-50%);

      position: absolute;
      overflow: hidden;
      z-index: $pills;

      margin: 0 auto;
      height: auto;

      top: 50%;
      right: 0;
      left: 0;
    }

    @include breakpoint($xs) {
      @include console-button(3px);
      padding: 5vh 0;
    }

    .button {
      @include white-rabbit;

      line-height: 130px;
      font-size: 50px;
      padding: 0;

      @include breakpoint($sm-down) {
        line-height: 100px;
        font-size: 40px;
        height: 100px;
      }

      @include breakpoint($xs) {
        line-height: 60px;
        font-size: 25px;
        height: 60px;
      }
    }
  }
}

.button-border {
  display: flex;
  margin: auto;
  height: 25vh;

  @include breakpoint($sm-down) {
    height: 20vh;
  }

  .button-box {
    transform: translateY(-50%);
    position: relative;
    top: 50%;

    height: 130px;
    width: 500px;

    &.visible {
      visibility: visible;
    }

    @include breakpoint($sm-down) {
      margin: 0 auto;
      height: 100px;
      width: 350px;
    }

    @include breakpoint($xs) {
      height: 60px;
      width: 200px;
    }

    .button-background {
      height: 130px;
      width: 500px;

      @include breakpoint($sm-down) {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
