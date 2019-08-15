<template>
  <div @touchstart="onTouchStart" @touchend="onTouchEnd" class="list-area">
    <div :style="{'-webkit-transform': 'translateY(' + listOffset + ')', 'transform': 'translateY(' + listOffset + ')'}"
          class="list-container" :class="{'contacts': contacts}" itemtype="http://schema.org/ItemList" itemscope>

      <div :class="{'active': enableNavigation && (currentPage === p), 'visible': skipLettering}"
           v-for="(page, p) in pagesList" :key="page.name" @click="onPageClick(p)"
           class="page-container" ref="urls" itemprop="item">

        <span class="selected-page" :class="{'dissolve': dispose}">{{ contacts ? '>' : '//' }}</span>
        <p itemprop="name" class="page-name">{{ page.name }}</p>
        <span v-if="contacts && p === 3" class="e-mail"> - ustym.ukhman@gmail.com</span>
      </div>

    </div>
  </div>
</template>

<script>
import Lettering from '@/utils/Lettering'
import Viewport from '@/mixins/Viewport'
import Loading from '@/utils/Loading'

import { phone } from '@/_variables.scss'
import Platform from '@/platform'

export default {
  name: 'PageList',

  mixins: [Viewport],

  props: {
    urls: {
      type: Array,
      required: true
    },

    activeBack: {
      type: Boolean,
      default: false,
      required: false
    },

    selectedBack: {
      type: Boolean,
      default: false,
      required: false
    },

    skipLettering: {
      type: Boolean,
      default: false,
      required: false
    },

    dispose: {
      type: Boolean,
      default: false,
      required: false
    },

    contacts: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      currentPage: Platform.mobile ? null : 0,
      enableNavigation: false,
      touchStart: null,

      scrollOffset: null,
      listOffset: null,
      listStep: null,

      pageIndex: -1,
      pagesList: [],
      words: []
    }
  },

  watch: {
    viewPort () {
      this.listStep = this.viewPort.height * 0.14 + (this.viewPort.width < phone ? 18 : 21)
      this.scrollOffset = (this.urls.length - 5) * -this.listStep
    },

    dispose () {
      this.lettering.disposeAll(this.words)
    },

    skipLettering () {
      this.lettering.skipLettering()
    }
  },

  methods: {
    showPages () {
      for (let i = 0; i < this.urls.length; i++) {
        let url = Object.keys(this.urls[i])[0]

        this.pagesList.push({
          url: this.urls[i][url],
          name: url
        })
      }

      if (this.urls.length < 6) {
        this.listOffset = '-50%'
      }

      setTimeout(() => {
        this.pages = this.$refs.urls
        this.lastPage = this.urls.length - (Platform.mobile ? 5 : 4)
        this.lastUrl = this.urls.length - 1
        this.preparePages()
      })
    },

    preparePages (endAnimation = false) {
      if (!endAnimation) {
        const delay = this.skipLettering ? 0 : 500

        setTimeout(() => {
          const index = this.pageIndex
          const nextIndex = ++this.pageIndex
          const lastPage = this.lastPage - (Platform.mobile ? 0 : 1)
          const scrollableList = this.urls.length > 5 && index < lastPage

          if (!this.pages[nextIndex]) {
            this.preparePages(true)
            return
          }

          if (!this.skipLettering && scrollableList) {
            this.listOffset = `${nextIndex * -this.listStep}px`
          }

          this.words.push(
            this.lettering.animate(
              this.pages[nextIndex].children[1],
              50, this.preparePages.bind(this), 0
            )
          )

          if (this.skipLettering) {
            this.lettering.skipLettering()
            this.preparePages()
          }
        }, delay)
      } else {
        this.enableNavigation = true
        this.$emit('show:components')
        this.$emit('update:skipLettering', true)
        this.listOffset = this.urls.length < 6 ? '-50%' : '0px'
      }
    },

    onKeyDown ($event) {
      if (this.activeBack && $event.keyCode === 13) {
        this.$emit('update:selectedBack', true)
      }
    },

    onKeyUp ($event) {
      if (!this.enableNavigation) {
        return
      }

      let active = false
      const code = $event.keyCode
      const page = this.currentPage

      if (!this.checkValidCode(code)) {
        return
      } else if (this.activeBack && code === 13) {
        this.$emit('update:selectedBack', false)
        this.lettering.disposeAll(this.words)
        return
      } else if (this.activeBack) {
        this.currentPage = (code === 38) ? 0 : this.lastUrl
        this.$emit('update:activeBack', false)
      } else {
        active = ((this.currentPage === this.lastUrl && code === 40) || (!this.currentPage && code === 38))
        this.$emit('update:activeBack', active)
      }

      if (code === 13) {
        this.openPageUrl(page)
      } else if (code === 38) {
        this.currentPage = (!this.currentPage) ? this.lastUrl : this.currentPage - 1
      } else if (code === 40) {
        this.currentPage = (this.currentPage === this.lastUrl) ? 0 : this.currentPage + 1
      }

      this.$emit('update:index', this.currentPage)

      if (this.urls.length > 5) {
        this.listOffset = (this.currentPage < this.lastPage) ? `${this.currentPage * -this.listStep}px` : this.listOffset
      } else {
        this.listOffset = '-50%'
      }

      if (active) {
        this.currentPage = -1

        if (this.urls.length > 5) {
          this.listOffset = `${(this.lastPage - 1) * -this.listStep}px`
        }
      }
    },

    checkValidCode (code) {
      return (code === 13 || code === 38 || code === 40)
    },

    openPageUrl (page) {
      window.open(this.pagesList[page].url, '_blank')
    },

    onTouchStart ($event) {
      if (this.urls.length > 5) {
        this.touchStart = $event.changedTouches[0].clientY
      }
    },

    onTouchEnd ($event) {
      if (this.urls.length > 5) {
        const distance = this.touchStart - $event.changedTouches[0].clientY
        let scroll = +this.listOffset.slice(0, -2)
        const direction = distance > 0 ? 3 : -3

        if ((scroll <= this.scrollOffset && direction === 3) || (!scroll && direction === -3)) {
          return
        }

        if (Math.abs(distance) > 100) {
          scroll = scroll - this.listStep * direction
          this.listOffset = `${+scroll.toFixed(1)}px`
        }
      }
    },

    onPageClick (page) {
      if (this.enableNavigation) {
        this.currentPage = page
        setTimeout(() => { this.openPageUrl(page) }, 400)
      }
    }
  },

  mounted () {
    this._onKeyUp = this.onKeyUp.bind(this)
    this._onKeyDown = this.onKeyDown.bind(this)

    document.addEventListener('keyup', this._onKeyUp, false)
    document.addEventListener('keydown', this._onKeyDown, false)

    Loading.setActiveItem(this.contacts ? 2 : 1)
    this.lettering = new Lettering()
    this.showPages()
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this._onKeyDown, false)
    document.removeEventListener('keyup', this._onKeyUp, false)
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.list-area {
  padding-left: 100px;
  position: fixed;
  margin: auto;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($md) {
    padding-left: 50px;
  }

  @include breakpoint($sm-down) {
    pointer-events: all;
    padding-left: 0;
  }

  .list-container {
    transition: transform 0.5s $ease-out-sine;
    backface-visibility: hidden;

    position: absolute;
    top: 0;

    &.contacts {
      top: 50%;
    }

    @include breakpoint($sm-down) {
      padding-left: 50px;
      width: 100%;
    }

    @include breakpoint($xs) {
      padding-left: 25px;
    }
  }
}

.page-container {
  visibility: hidden;
  display: block;
  margin: 14vh 0;

  &.visible {
    visibility: visible;
  }

  &.active {
    .selected-page {
      visibility: visible;
      opacity: 1;

      &.dissolve {
        transition-duration: 0.5s;
        transition-delay: 0.5s;
        opacity: 0;
      }
    }

    .e-mail {
      transform: translateX(25px);
      transition-delay: 0.1s;
      opacity: 1;

      @include breakpoint($xs) {
        transform: translateX(20px);
      }
    }

    .page-name {
      transform: translateX(25px);
      position: relative;
      color: $fade-green;

      @include breakpoint($sm-down) {
        transform: translateX(20px);
      }

      @include breakpoint($xs) {
        transform: translateX(15px);
      }
    }
  }

  @media only screen and (max-height: 550px) {
    margin: 12vh 0;
  }

  .page-name,
  .selected-page {
    @include white-rabbit;

    display: inline-block;
    font-size: 25px;

    @include breakpoint($xs) {
      font-size: 18px;
    }
  }

  .page-name {
    transition: transform 0.4s $ease-out-quart;
    line-height: 20px;

    @include breakpoint($xs) {
      line-height: 18px;
    }
  }

  .selected-page {
    transition: opacity 0.2s $ease-in-out-cubic;
    visibility: hidden;
    opacity: 0;
  }

  .e-mail {
    @include white-rabbit;

    transition: transform 0.4s $ease-out-quart, opacity 0.3s;
    white-space: nowrap;
    visibility: visible;
    position: absolute;

    font-style: italic;
    margin-left: 10px;
    line-height: 25px;
    font-size: 25px;

    color: $fade-green;
    width: auto;
    opacity: 0;

    @include breakpoint($sm-down) {
      line-height: 25px;
      margin-top: 5px;
    }

    @include breakpoint($xs) {
      font-size: 13px;
      margin-left: 0;
      margin-top: 0;
    }
  }
}
</style>
