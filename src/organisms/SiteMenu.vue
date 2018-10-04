<template>
  <section class="menu-section">
    <transition appear name="fade-out">
      <div class="menu-items" :class="{'hidden': hiddenItems}">
        <div v-for="(page, p) in pages" :key="p" class="button-border">

          <div ref="items" class="button-box" :class="{'active': activePage(p), 'selected': p === settedSection}">
            <div class="button-background"></div>
            <p class="button">{{ page }}</p>
          </div>

        </div>
      </div>
    </transition>
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
      currentItem: Loading.getActiveItem(),
      settedSection: null,
      lettering: null,
      nextPage: false,
      itemIndex: -1,
      words: [],

      stopRaining: false,
      hiddenItems: true,
      showRain: false,

      pages: [
        'Ab0uT_m3',
        'My_W0rk5',
        'C0nT@cT_m3'
      ]
    }
  },

  methods: {
    activePage (page) {
      return page === this.currentItem && !this.hiddenItems && !this.nextPage
    },

    showMenuItems () {
      if (++this.itemIndex < this.pages.length) {
        this.lettering = new Lettering()

        this.words.push(
          this.lettering.animate(
            this.items[this.itemIndex].children[1],
            50, this.showMenuItems.bind(this), 500
          )
        )
      } else {
        this.hiddenItems = false
        this._onKeyDown = this.onKeyDown.bind(this)
        this.currentItem = Platform.mobile ? null : Loading.getActiveItem() || 0

        setTimeout(() => {
          this.showRain = true
        }, 1500)

        document.addEventListener('keydown', this._onKeyDown, false)

        if (Platform.mobile) {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('touchend', this.onClick.bind(this, i))
          }
        }
      }
    },

    onKeyDown (event) {
      const item = this.currentItem
      const code = event.keyCode

      if (code === 13) {
        this.setMenuSection()
      } else if (code === 38) {
        this.currentItem = (!item) ? 3 : item - 1
      } else if (code === 40) {
        this.currentItem = (item === 3) ? 0 : item + 1
      }
    },

    onClick (index) {
      this.currentItem = index
      this.onKeyDown({ keyCode: 13 })
    },

    setMenuSection () {
      this.nextPage = true
      this.settedSection = this.currentItem
      this.lettering.disposeAll(this.words)

      document.removeEventListener('keydown', this._onKeyDown, false)

      if (Platform.mobile) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].removeEventListener('touchend', this.onClick.bind(this, i))
        }
      }

      setTimeout(() => {
        this.stopRaining = true
        this.$router.push({
          name: Loading.getPageName(this.settedSection)
        })
      }, 3000)
    }
  },

  mounted () {
    const experiments = Platform.ie11 || Platform.mobile
    this.pages.push(experiments ? '3xp3r!m3nT5' : 'M0r3')

    setTimeout(() => {
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

    @include breakpoint($md-down) {
      margin-left: 0;
    }

    @include breakpoint($sm-down) {
      transform: translateY(-50%);
      position: absolute;
      overflow: hidden;
      z-index: $pills;

      margin-left: 0;
      height: auto;

      width: 100%;
      top: 50%;
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
