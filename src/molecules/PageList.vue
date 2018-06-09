<template>
  <div :style="{'-webkit-transform': 'translateY(' + listOffset + ')', 'transform': 'translateY(' + listOffset + ')'}"
       @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onKeyDown" class="list-area">

    <div v-for="(page, p) in pagesList" :key="page.name" ref="urls" @touchend="onTouchend(p)"
         class="page-container" :class="{'active': enableNavigation && (currentPage === p)}">

      <span class="selected-page">{{cursor}}</span>
      <p class="page-name">{{page.name}}</p>
      <span v-if="p === emailIndex" class="e-mail"> - ustym.ukhman@gmail.com</span>

    </div>
  </div>
</template>

<script>
import Lettering from '@/utils/Lettering'
import Viewport from '@/mixins/Viewport'

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

    cursor: {
      type: String,
      required: true
    },

    activeBack: {
      type: Boolean,
      default: false,
      required: false
    },

    emailIndex: {
      type: Number,
      default: null,
      required: false
    }
  },

  data () {
    return {
      visibleList: (window.innerHeight * 0.14 + 18) * 5,
      currentPage: Platform.mobile ? null : 0,

      listHeight: null,
      listOffset: null,

      enableNavigation: false,
      skipLettering: false,
      touchStart: null,

      pageIndex: -1,
      pagesList: []
    }
  },

  watch: {
    viewPort () {
      const margin = this.viewPort.height * 0.14
      const height = this.viewPort.width < phone ? 18 : 21

      this.listStep = margin + height
      this.listHeight = this.listStep * this.urls.length
      this.listLength = this.listHeight + margin
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

          this.lettering.animate(
            this.pages[nextIndex].children[1],
            50, this.preparePages.bind(this), 0
          )

          if (this.skipLettering) {
            this.lettering.skipLettering()
            this.preparePages()
          }
        }, delay)
      } else {
        this.skipLettering = true

        setTimeout(() => {
          this.enableNavigation = true
          this.$emit('show:components')
          this.listOffset = this.urls.length < 6 ? '-50%' : 0
        })
      }
    },

    onKeyDown ($event) {
      if (!this.skipLettering) {
        this.lettering.skipLettering()
        this.skipLettering = true
        return
      }

      if (!this.enableNavigation) {
        return
      }

      let active = false
      const code = $event.keyCode
      const page = this.currentPage

      if (!this.checkValidCode(code)) {
        return
      } else if (this.activeBack && code === 13) {
        this.removePagesList()
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
        this.listOffset = (this.currentPage < this.lastPage)
          ? `${this.currentPage * -this.listStep}px` : this.listOffset
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

    removePagesList () {
      document.removeEventListener('keydown', this._onKeyDown, false)
      this.$emit('remove:pages')
    },

    openPageUrl (page) {
      window.open(this.pagesList[page].url, '_blank')
    },

    onTouchStart ($event) {
      if (this.urls.length > 5) {
        this.touchStart = $event.changedTouches[0].clientY
      }
    },

    onTouchMove ($event) {
      if (this.urls.length > 5) {
        const offset = $event.changedTouches[0].clientY
        const distance = Math.max(0, this.touchStart - offset)

        if (this.visibleList + distance <= this.listLength) {
          this.listOffset = `${-distance}px`
        }
      }
    },

    onTouchend (page) {
      this.currentPage = page
      setTimeout(() => { this.openPageUrl(page) }, 400)
    }
  },

  mounted () {
    this._onKeyDown = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this._onKeyDown, false)

    this.lettering = new Lettering()
    this.showPages()
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this._onKeyDown, false)
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.list-area {
  transition: transform 0.5s $ease-out-sine;
  backface-visibility: hidden;
  position: absolute;

  bottom: 0;
  top: 0;

  @include breakpoint($sm-down) {
    transition-duration: 250ms;
    padding-left: 50px;
    width: 100%;
  }

  @include breakpoint($xs) {
    padding-left: 25px;
  }
}

.page-container {
  visibility: hidden;
  display: block;
  margin: 14vh 0;

  @media only screen and (max-height: 550px) {
    margin: 12vh 0;
  }

  &.active {
    .selected-page {
      visibility: visible;
    }

    .e-mail {
      transform: translateX(25px);
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

  .page-name,
  .selected-page {
    @include white-rabbit;

    transition: transform 0.3s ease-out;
    display: inline-block;
    font-size: 25px;

    @include breakpoint($xs) {
      font-size: 18px;
    }
  }

  .page-name {
    line-height: 20px;

    @include breakpoint($xs) {
      line-height: 18px;
    }
  }

  .selected-page {
    visibility: hidden;
  }

  .e-mail {
    @include white-rabbit;

    transition: transform 0.3s ease-out, opacity 0.3s;
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
