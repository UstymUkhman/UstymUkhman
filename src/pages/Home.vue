<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <div itemtype="http://schema.org/Menu" class="menu-items" itemscope>
      <div v-for="(page, p) in pages" :key="page" class="button-border">

        <div :ref="button => { items[p] = button }" class="button-box" itemtype="https://schema.org/MenuItem"
             @touchstart.once="onTouchStart(p)" @touchend.once="onTouchEnd"
             :class="{
               'selected': p === settedSection && !nextPage,
               'active': isActiveButton(p),
               'visible': skipLettering,
               'pressed': pressed
             }" itemscope>

          <div class="button-background"></div>
          <p itemprop="name" class="button">{{ page }}</p>
        </div>

      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { TouchEventListener, Lettering, Loading, Platform, firePrerender } from '@/utils'
import { Ref, defineComponent, onMounted, reactive, ref } from 'vue'
import router from '@/router'

type FakeKeyboardEvent = { keyCode: number }

interface TemplateValues {
  readonly isActiveButton: (index: number) => boolean
  readonly onTouchStart: (index: number) => void
  readonly onTouchEnd: TouchEventListener
  readonly skipLettering: Ref<boolean>
  readonly settedSection: Ref<number>
  readonly currentItem: Ref<number>
  readonly nextPage: Ref<boolean>
  readonly pressed: Ref<boolean>
  readonly pages: Array<string>
  readonly items: Ref<never[]>
}

export default defineComponent({
  name: 'Home',

  setup (): TemplateValues {
    function skipMenuLettering (): void {
      if (lettering) {
        skipLettering.value = true
        lettering.skipLettering()
        typingTimeout = 0

        if (Platform.mobile) {
          visibleButtons = reactive([0, 1, 2])
        }
      }
    }

    function showMenuItems (): void {
      if (++itemIndex < pages.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lettering = new Lettering((items.value[itemIndex] as any).children[1], 50, typingTimeout)

        words.push(lettering.animate(showMenuItems))

        if (skipLettering.value) {
          lettering.skipLettering()
        } else if (Platform.mobile) {
          setTimeout(() => { visibleButtons.push(itemIndex) }, typingTimeout)
        }
      }

      else if (currentItem.value < 0) {
        currentItem.value = Platform.mobile ? -1 : Loading.activeItem
        toggleKeyListeners()
      }
    }

    function toggleKeyListeners (): void {
      document.removeEventListener('touchend', skipMenuLettering, false)
      document.removeEventListener('keyup', skipMenuLettering, false)

      setTimeout(() => {
        if (!Platform.mobile) visibleItems = items.value.length - 1
        document.addEventListener('keydown', onKeyDown, false)
        document.addEventListener('keyup', onKeyUp, false)
      }, 100)
    }

    function onKeyDown (event: KeyboardEvent | FakeKeyboardEvent): void {
      if (event.keyCode === 13 && !pressed.value) {
        settedSection.value = currentItem.value
        pressed.value = true
      }
    }

    function onKeyUp (event: KeyboardEvent | FakeKeyboardEvent): void {
      const code = event.keyCode
      const item = currentItem.value

      if (event.keyCode === 13) {
        setMenuSection()
      } else if (code === 38) {
        currentItem.value = !item ? visibleItems : item - 1
      } else if (code === 40) {
        currentItem.value = (item === visibleItems) ? 0 : item + 1
      }
    }

    function onTouchStart (index: number) {
      if (visibleButtons.length < 3) {
        return
      }

      currentItem.value = index
      onKeyDown({ keyCode: 13 })
    }

    function onTouchEnd () {
      if (visibleButtons.length < 3) {
        return
      }

      onKeyUp({ keyCode: 13 })
      visibleButtons = reactive([])
    }

    function setMenuSection (): void {
      const nextSection = currentItem.value
      lettering.disposeAll(words)

      settedSection.value = -1
      nextPage.value = true
      pressed.value = false

      document.removeEventListener('keyup', onKeyUp, false)
      document.removeEventListener('keydown', onKeyDown, false)

      setTimeout(() => {
        settedSection.value = nextSection
        router.push({ name: Loading.getPageName(nextSection) })
      }, 2500)
    }

    function isActiveButton (index: number): boolean {
      const mobileButtons: boolean = visibleButtons.includes(index)
      return (index === currentItem.value && !nextPage.value) || mobileButtons
    }

    const pages = reactive(['Ab0uT_m3', 'My_W0rk5', 'C0nT@cT_m3'])
    let visibleButtons: Array<number> = reactive([])
    const words: Array<Array<HTMLSpanElement>> = []

    let skipLettering = ref(false)
    let settedSection = ref(-1)
    let currentItem = ref(-1)
    let nextPage = ref(false)
    let pressed = ref(false)
    const items = ref([])

    let lettering: Lettering
    let visibleItems: number
    let typingTimeout = 500
    let itemIndex = -1

    onMounted(() => {
      document.addEventListener('keyup', skipMenuLettering, false)
      document.addEventListener('touchend', skipMenuLettering, false)

      if (!Platform.mobile) {
        pages.push('M0r3')
      }

      setTimeout(showMenuItems, 500)
      firePrerender()
    })

    return {
      isActiveButton,
      settedSection,
      skipLettering,
      onTouchStart,
      currentItem,
      onTouchEnd,
      nextPage,
      pressed,
      pages,
      items
    }
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  @include center-size;
  z-index: $menu;

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
      @include white-rabbit(50px);
      line-height: 130px;
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
    @include size(500px, 130px);
    transform: translateY(-50%);
    position: relative;
    top: 50%;

    &.visible {
      visibility: visible;
    }

    @include breakpoint($sm-down) {
      @include size(350px, 100px);
      margin: 0 auto;
    }

    @include breakpoint($xs) {
      @include size(200px, 60px);
    }

    .button-background {
      @include size(500px, 130px);

      @include breakpoint($sm-down) {
        @include size;
      }
    }
  }
}
</style>
