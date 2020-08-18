<template>
  <div @touchstart="onTouchStart" @touchend="onTouchEnd" class="links">
    <ul :style="{'transform': `translateY(${listOffset})`}" itemtype="http://schema.org/ItemList" itemscope>

      <ExternalLink
        v-for="(page, p) in urls" :key="page.name"
        :active="enabled && current === p"
        :cursor="contacts ? '>' : '//'"
        :ref="li => { pages[p] = li }"
        :mail="contacts && p === 3"
        @click="onPageClick(p)"
        :dissolve="dispose"
        :page="page.name"
        :visible="skip"
      />

    </ul>
  </div>
</template>

<script lang="ts">
import { VueHTMLElement, TouchEventListener, Lettering, Loading, Viewport, Platform, phoneWidth } from '@/utils'
import { SetupContext, Ref, defineComponent, watchEffect, onMounted, onBeforeUnmount, ref } from 'vue'
import ExternalLink from '@components/ExternalLink.vue'

interface TemplateValues {
  readonly onPageClick: (index: number) => void
  readonly pages: Ref<Array<HTMLLIElement>>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly listOffset: Ref<string>
  readonly enabled: Ref<boolean>
  readonly current: Ref<number>
}

export default defineComponent({
  name: 'LinksList',

  components: {
    ExternalLink
  },

  props: {
    urls: {
      required: true,
      type: Array
    },

    selectedBack: {
      required: false,
      default: false,
      type: Boolean
    },

    activeBack: {
      required: false,
      default: false,
      type: Boolean
    },

    contacts: {
      required: false,
      default: false,
      type: Boolean
    },

    dispose: {
      required: false,
      default: false,
      type: Boolean
    },

    skip: {
      required: false,
      default: false,
      type: Boolean
    }
  },

  setup (props, context: SetupContext): TemplateValues {
    function onTouchStart (event: TouchEvent): void {
      if (props.urls.length > 5) {
        touchStart = event.changedTouches[0].clientY
      }
    }

    function onTouchEnd (event: TouchEvent): void {
      if (props.urls.length > 5) {
        const distance = touchStart - event.changedTouches[0].clientY
        const direction = distance > 0 ? 3 : -3
        let scroll = +listOffset.value.slice(0, -2)

        if ((scroll <= scrollOffset && direction === 3) || (!scroll && direction === -3)) {
          return
        }

        if (Math.abs(distance) > 100) {
          scroll = scroll - listStep * direction
          listOffset.value = `${+scroll.toFixed(1)}px`
        }
      }
    }

    function onKeyDown (event: KeyboardEvent): void {
      if (props.activeBack && event.keyCode === 13) {
        context.emit('update:selectedBack', true)
      }
    }

    function onKeyUp (event: KeyboardEvent): void {
      if (!enabled.value) return

      const code = event.keyCode
      const page = current.value
      let active = false

      if (code !== 13 && code !== 38 && code !== 40) return

      else if (props.activeBack && code === 13) {
        context.emit('update:selectedBack', false)
        return lettering.dissolveAll(words)
      }

      else if (props.activeBack) {
        current.value = (code === 38) ? 0 : lastUrl
        context.emit('update:activeBack', false)
      }

      else {
        active = ((current.value === lastUrl && code === 40) || (!current.value && code === 38))
        context.emit('update:activeBack', active)
      }

      if (code === 13) openPageUrl(page)
      else if (code === 38) current.value = (!current.value) ? lastUrl : current.value - 1
      else if (code === 40) current.value = (current.value === lastUrl) ? 0 : current.value + 1

      context.emit('update:index', current.value)

      listOffset.value = props.urls.length < 6 ? '-50%' :
        (current.value < lastPage) ? `${current.value * -listStep}px` : listOffset.value

      if (active) {
        current.value = -1

        if (props.urls.length > 5) listOffset.value = `${(lastPage - 1) * -listStep}px`
      }
    }

    function onPageClick (page: number): void {
      if (enabled.value) {
        current.value = page
        setTimeout(() => { openPageUrl(page) }, 400)
      }
    }

    function openPageUrl (page: number): void {
      window.open((props.urls[page] as Page).url, '_blank')
    }

    function preparePages (endAnimation = false): void {
      if (!endAnimation) {
        const delay = props.skip ? 0 : 500

        setTimeout(() => {
          const index = pageIndex
          const next = ++pageIndex

          const last = lastPage - (Platform.mobile ? 0 : 1)
          const scrollableList = props.urls.length > 5 && index < last

          if (!pages.value[next]) return preparePages(true)

          if (!props.skip && scrollableList) {
            listOffset.value = `${next * -listStep}px`
          }

          lettering = new Lettering((
            pages.value[next] as VueHTMLElement<HTMLLIElement>
          ).$el.children[1] as HTMLParagraphElement,
          50, 0)

          words.push(lettering.animate(preparePages))

          if (props.skip) {
            lettering.skipLettering()
            preparePages()
          }
        }, delay)
      }

      else {
        enabled.value = true
        context.emit('show-button')
        context.emit('update:skip', true)
        listOffset.value = props.urls.length < 6 ? '-50%' : '0px'
      }
    }

    function showPages (): void {
      if (props.urls.length < 6) {
        listOffset.value = '-50%'
      }

      setTimeout(() => {
        lastPage = props.urls.length - (Platform.mobile ? 5 : 4)
        lastUrl = props.urls.length - 1
        preparePages()
      })
    }

    watchEffect(() => { if (lettering && props.skip) lettering.skipLettering() })

    watchEffect(() => { if (props.dispose) lettering.dissolveAll(words) })

    const current: Ref<number> = ref(Platform.mobile ? -1 : 0)
    const pages: Ref<Array<HTMLLIElement>> = ref([])
    const words: Array<Array<HTMLSpanElement>> = []
    const listOffset: Ref<string> = ref('0px')
    const enabled: Ref<boolean> = ref(false)

    const screen = new Viewport((size) => {
      listStep = size.height * 0.14 + (size.width < phoneWidth ? 18 : 21)
      scrollOffset = (props.urls.length - 5) * -listStep
    })

    let lettering: Lettering
    let scrollOffset: number
    let touchStart: number
    let lastPage: number

    let listStep: number
    let lastUrl: number
    let pageIndex = -1

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
      Loading.activeItem = props.contacts ? 2 : 1

      showPages()
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown, false)
      document.removeEventListener('keyup', onKeyUp, false)
      screen.dispose()
    })

    return {
      onTouchStart,
      onPageClick,
      onTouchEnd,
      listOffset,
      current,
      enabled,
      pages
    }
  }
})
</script>

<style lang="scss" scoped>
.links {
  @include center-size;
  padding-left: 100px;
  position: fixed;

  @include breakpoint($md) {
    padding-left: 50px;
  }

  @include breakpoint($sm-down) {
    pointer-events: all;
    padding-left: 0;
  }

  ul {
    transition: transform 0.5s $ease-out-sine;
    backface-visibility: hidden;

    list-style-type: unset;
    position: absolute;

    margin: 0;
    top: 0;

    @include breakpoint($sm-down) {
      padding-left: 50px;
      width: auto;
    }

    @include breakpoint($xs) {
      padding-left: 25px;
    }
  }
}
</style>
