<template>
  <article itemtype="http://schema.org/WebPage" class="home-page" itemscope>
    <div itemtype="http://schema.org/Menu" class="menu-items" itemscope>
      <div v-for="(page, p) in pages" :key="page" class="button-border">

        <div :ref="button => { items[p] = button }" class="button-box" itemtype="https://schema.org/MenuItem"
             @touchstart.once="onTouchStart(p)" @touchend.once="onTouchEnd" itemscope
             :class="{
               'selected': p === settedSection && !nextPage,
               'active': isActiveButton(p),
               'visible': skipLettering,
               'pressed': pressed
             }">

          <div class="button-background"></div>
          <p itemprop="name" class="button">{{ page }}</p>
        </div>

      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { TouchEventListener, Lettering, Loading, Platform, firePrerender } from '@/utils'
import { Ref, defineComponent, reactive, ref, onMounted } from 'vue'
import router from '@/router'

type FakeKeyboardEvent = {
  code: string
  key?: string
}

interface TemplateValues {
  readonly isActiveButton: (index: number) => boolean
  readonly onTouchStart: (index: number) => void
  readonly items: Ref<Array<HTMLDivElement>>
  readonly onTouchEnd: TouchEventListener
  readonly skipLettering: Ref<boolean>
  readonly settedSection: Ref<number>
  readonly currentItem: Ref<number>
  readonly nextPage: Ref<boolean>
  readonly pressed: Ref<boolean>
  readonly pages: Array<string>
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
        lettering = new Lettering(
          items.value[itemIndex].children[1] as HTMLParagraphElement
        , 50, typingTimeout)

        words.push(lettering.animate(showMenuItems))

        if (skipLettering.value) {
          lettering.skipLettering()
        }

        else if (Platform.mobile) {
          setTimeout(() => visibleButtons.push(itemIndex), typingTimeout)
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
      const code = event.code || event.key

      if (code === 'Enter' && !pressed.value) {
        settedSection.value = currentItem.value
        pressed.value = true
      }
    }

    function onKeyUp (event: KeyboardEvent | FakeKeyboardEvent): void {
      const code = event.code || event.key
      const item = currentItem.value

      if (code === 'Enter') {
        setMenuSection()
      } else if (code === 'ArrowUp') {
        currentItem.value = !item ? visibleItems : item - 1
      } else if (code === 'ArrowDown') {
        currentItem.value = (item === visibleItems) ? 0 : item + 1
      }
    }

    function onTouchStart (index: number) {
      if (visibleButtons.length < 3) return

      currentItem.value = index
      onKeyDown({ code: 'Enter' })
    }

    function onTouchEnd () {
      if (visibleButtons.length < 3) return

      onKeyUp({ code: 'Enter' })
      visibleButtons = reactive([])
    }

    function setMenuSection (): void {
      const nextSection = currentItem.value
      lettering.dissolveAll(words)

      settedSection.value = -1
      nextPage.value = true
      pressed.value = false

      document.removeEventListener('keyup', onKeyUp, false)
      document.removeEventListener('keydown', onKeyDown, false)

      setTimeout(() => {
        settedSection.value = nextSection
        router.push({ name: Loading.getPageName(nextSection), params: { homePage: 'true' }})
      }, 2500)
    }

    function isActiveButton (index: number): boolean {
      return (index === currentItem.value && !nextPage.value) || visibleButtons.includes(index)
    }

    const pages = reactive(['Ab0uT_m3', 'My_W0rk5', 'C0nT@cT_m3'])
    const items: Ref<Array<HTMLDivElement>> = ref([])
    let visibleButtons: Array<number> = reactive([])
    const words: Array<Array<HTMLSpanElement>> = []

    let skipLettering = ref(false)
    let settedSection = ref(-1)
    let currentItem = ref(-1)
    let nextPage = ref(false)
    let pressed = ref(false)

    let lettering: Lettering
    let visibleItems: number
    let typingTimeout = 500
    let itemIndex = -1

    onMounted(() => {
      firePrerender()
      if (Platform.prerender) return

      document.addEventListener('touchend', skipMenuLettering, false)
      document.addEventListener('keyup', skipMenuLettering, false)

      if (!Platform.mobile && !Platform.edge) pages.push('M0r3')
      setTimeout(showMenuItems, 500)
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
  z-index: 12;

  .menu-items {
    @include console-button(5px);
    transform: translateY(-50%);
    margin-left: 100px;

    position: absolute;
    display: block;
    top: 50%;

    @include breakpoint($md-down) {
      margin-left: 0;
    }

    @include breakpoint($sm-down) {
      transform: translate(-50%, -50%);
      margin: 0 auto;
      height: auto;

      z-index: 8;
      left: 50%;
      top: 50%;
    }

    @include breakpoint($xs) {
      @include console-button(3px);
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
  @include size(500px, 130px);
  @include vh(height, 25);
  display: block;

  @include breakpoint($sm-down) {
    @include vh(height, 20);
    width: 350px;
  }

  @include breakpoint($xs) {
    width: 200px;
  }

  .button-box {
    @include size(100%, 130px);
    transform: translateY(-50%);
    position: relative;
    top: 50%;

    @include breakpoint($sm-down) {
      margin: 0 auto;
      height: 100px;
    }

    @include breakpoint($xs) {
      height: 60px;
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
