<template>
  <div @touchstart="onTouchStart" @touchend="onTouchEnd" class="links">
    <ul :style="{'transform': `translateY(${listOffset})`}" itemtype="http://schema.org/ItemList" itemscope>

      <ExternalLink
        v-for="(link, l) in links" :key="link.name"
        itemtype="http://schema.org/ListItem"
        :active="enabled && current === l"

        :cursor="contacts ? '>' : '//'"
        :ref="li => { pages[l] = li }"
        :mail="contacts && l === 3"
        itemprop="itemListElement"

        @click="onLinkClick(l)"
        :dissolve="dispose"
        :link="link.name"
        :visible="skip"
      />

    </ul>
  </div>
</template>

<script lang="ts">
import { SetupContext, Ref, defineComponent, watchEffect, ref, onMounted, onBeforeUnmount } from 'vue'
import { TouchEventListener, Lettering, Loading, Platform, phoneWidth } from '@/utils'

type VueHTMLElement<HTMLElement> = HTMLElement & { $el: HTMLElement }

import ExternalLink from '@components/ExternalLink.vue'
import { Viewport, Size } from '@/utils/Viewport'

interface TemplateValues {
  readonly onLinkClick: (index: number) => void
  readonly pages: Ref<Array<HTMLLIElement>>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly listOffset: Ref<string>
  readonly enabled: Ref<boolean>
  readonly current: Ref<number>
  readonly skip: Ref<boolean>
}

export default defineComponent({
  name: 'LinksList',

  components: {
    ExternalLink
  },

  props: {
    links: {
      type: Array,
      required: true
    },

    selectedBack: {
      type: Boolean,
      default: false,
      required: false
    },

    activeBack: {
      type: Boolean,
      default: false,
      required: false
    },

    contacts: {
      type: Boolean,
      default: false,
      required: false
    },

    dispose: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  setup (props, context: SetupContext): TemplateValues {
    function onTouchStart (event: TouchEvent): void {
      if (props.links.length > 5) {
        touchStart = event.changedTouches[0].clientY
      }
    }

    function onTouchEnd (event: TouchEvent): void {
      if (props.links.length > 5) {
        const distance = touchStart - event.changedTouches[0].clientY
        const direction = distance > 0 ? 3 : -3
        let scroll = +listOffset.value.slice(0, -2)

        if ((scroll <= scrollOffset && distance > 0) || (!scroll && distance < 0)) return

        if (Math.abs(distance) > 100) {
          scroll -= listStep * direction
          listOffset.value = `${+scroll.toFixed(1)}px`
        }
      }
    }

    function onKeyDown (event: KeyboardEvent): void {
      if (props.activeBack && event.key === 'Enter') {
        context.emit('update:selectedBack', true)
      }
    }

    function onKeyUp (event: KeyboardEvent): void {
      if (!enabled.value) return

      const page = current.value
      const key = event.key
      let active = false

      if (key !== 'Enter' && key !== 'ArrowUp' && key !== 'ArrowDown') return

      else if (props.activeBack && key === 'Enter') {
        context.emit('update:selectedBack', false)
        return lettering.dissolveAll(words)
      }

      else if (props.activeBack) {
        current.value = (key === 'ArrowUp') ? 0 : lastLink
        context.emit('update:activeBack', false)
      }

      else {
        active = ((current.value === lastLink && key === 'ArrowDown') || (!current.value && key === 'ArrowUp'))
        context.emit('update:activeBack', active)
      }

      if (key === 'Enter') openPageUrl(page)
      else if (key === 'ArrowUp') current.value = (!current.value) ? lastLink : current.value - 1
      else if (key === 'ArrowDown') current.value = (current.value === lastLink) ? 0 : current.value + 1

      context.emit('index-update', current.value)

      listOffset.value = props.links.length < 6 ? '-50%' :
        (current.value < lastOffset) ? `${current.value * -listStep}px` : listOffset.value

      if (active) {
        current.value = -1
        if (props.links.length > 5) listOffset.value = `${(lastOffset - 1) * -listStep}px`
      }
    }

    function onLinkClick (page: number): void {
      if (enabled.value) {
        current.value = page
        setTimeout(() => openPageUrl(page), 400)
      }
    }

    function openPageUrl (page: number): void {
      window.open((props.links[page] as Page).url, '_blank')
    }

    function preparePages (endAnimation = false): void {
      if (!endAnimation) {
        const delay = skip.value ? 0 : 500

        setTimeout(() => {
          const index = pageIndex
          const next = ++pageIndex

          const last = lastOffset - (Platform.mobile ? 0 : 1)
          const scrollableList = props.links.length > 5 && index < last

          if (!pages.value[next]) return preparePages(true)

          if (!skip.value && scrollableList) {
            listOffset.value = `${next * -listStep}px`
          }

          lettering = new Lettering((
            pages.value[next] as VueHTMLElement<HTMLLIElement>
          ).$el.children[1] as HTMLParagraphElement, 50, 0)

          words.push(lettering.animate(preparePages))

          if (skip.value) {
            lettering.skipLettering()
            preparePages()
          }
        }, delay)
      }

      else {
        enabled.value = true
        context.emit('show-button')
        context.emit('update:skip', true)
        listOffset.value = props.links.length < 6 ? '-50%' : '0px'
      }
    }

    function removeSkipEvent (): void {
      document.removeEventListener('touchend', skipLettering, false)
      document.removeEventListener('keyup', skipLettering, false)
    }

    function skipLettering (): void {
      lettering.skipLettering()
      skip.value = true
      removeSkipEvent()
    }

    function onResize (size: Size): void {
      listStep = size.height * 0.14 + (size.width < phoneWidth ? 18 : 25)
      scrollOffset = (props.links.length - 5) * -listStep

      listOffset.value = props.links.length < 6 ? '-50%' :
        props.activeBack ? `${(lastOffset - 1) * -listStep}px` :
        (current.value < lastOffset) ? `${current.value * -listStep}px` : `${scrollOffset}px`
    }

    watchEffect(() => { if (props.dispose) lettering.dissolveAll(words) })
    const lastOffset = props.links.length - (Platform.mobile ? 5 : 4)
    const listOffset = ref(props.links.length < 6 ? '-50%' : '0px')

    const pages: Ref<Array<HTMLLIElement>> = ref([])
    const words: Array<Array<HTMLSpanElement>> = []

    const current = ref(Platform.mobile ? -1 : 0)
    const lastLink = props.links.length - 1
    const screen = new Viewport(onResize)

    const enabled = ref(false)
    let lettering: Lettering
    const skip = ref(false)

    let scrollOffset: number
    let touchStart: number
    let listStep: number
    let pageIndex = -1

    onMounted(() => {
      document.addEventListener('touchend', skipLettering, false)
      document.addEventListener('keyup', skipLettering, false)

      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)

      Loading.activeItem = props.contacts ? 2 : 1
      onResize(screen.size)
      preparePages()
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown, false)
      document.removeEventListener('keyup', onKeyUp, false)

      removeSkipEvent()
      screen.dispose()
    })

    return {
      onTouchStart,
      onLinkClick,
      onTouchEnd,
      listOffset,
      current,
      enabled,
      pages,
      skip
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

    list-style-type: none;
    position: absolute;
    padding-left: 0;

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
