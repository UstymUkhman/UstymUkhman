<template>
  <article @touchstart="onTouchStart" @touchend="onTouchEnd" itemtype="http://schema.org/AboutPage" class="about-page" itemscope>
    <p ref="paragraph" class="about-description" itemprop="description">
      Hi, my name is Ustym and I'm a front-end developer.\
      I'm working on too many things, trying to hack time to have more than 24 hours a day\
      and stay up to date on modern APIs, tools and all the awesome stuff you can do with them.\\

      Things I love:\
      /- Learning and using new web technologies\
      /- JavaScript, TypeScript, Vue.js & WebGL\
      /- Cinema, music, games, coffee & cats\\

      Things I hate:\
      /- Internet Explorer\
      /- Social Networks\
      /- Dirty code\
      /- Mondays\
    </p>

    <BackButton
      @close-page="closeAboutPage"
      :enabled="selectedButton"
      :focused="activeButton"
      v-if="visibleButton"
    />
  </article>
</template>

<script lang="ts">
import { TouchEventListener, Lettering, Loading, firePrerender } from '@/utils'
import { Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import BackButton from '@components/BackButton.vue'

interface TemplateValues {
  readonly paragraph: Ref<HTMLParagraphElement>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly closeAboutPage: () => void
}

export default defineComponent({
  name: 'About',

  components: {
    BackButton
  },

  setup (): TemplateValues {
    function enterKey (event: KeyboardEvent | TouchEvent): boolean {
      return event instanceof KeyboardEvent && (event.code || event.key) === 'Enter'
    }

    function onKeyDown (event: KeyboardEvent | TouchEvent): void {
      if (activeButton.value && enterKey(event)) {
        selectedButton.value = true
      }

      else if (!visibleButton.value) {
        lettering.skipLettering()
      }
    }

    function onKeyUp (event: KeyboardEvent | TouchEvent): void {
      if (selectedButton.value && enterKey(event)) {
        closeAboutPage()
      }
    }

    function closeAboutPage (): void {
      selectedButton.value = false
      activeButton.value = false
      lettering.dissolve()
    }

    const paragraph: Ref<HTMLParagraphElement> = ref()!

    const selectedButton = ref(false)
    const visibleButton = ref(false)
    const activeButton = ref(false)

    let lettering: Lettering

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)

      lettering = new Lettering(paragraph.value, 50)
      firePrerender({ title: 'About' })
      Loading.activeItem = 0

      lettering.animate(() => {
        setTimeout(() => { activeButton.value = true }, 1000)
        visibleButton.value = true
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown, false)
      document.removeEventListener('keyup', onKeyUp, false)
    })

    return {
      onTouchStart: onKeyDown,
      onTouchEnd: onKeyUp,
      closeAboutPage,
      selectedButton,
      visibleButton,
      activeButton,
      paragraph
    }
  }
})
</script>

<style lang="scss" scoped>
.about-page {
  @include center-size;
  overflow: hidden;
  z-index: 3;

  .about-description {
    @include center-size(950px, 390px);
    @include white-rabbit;

    position: absolute;
    line-height: 28px;

    &.description-leave-active {
      transition: opacity 1s linear 3.5s;
    }

    &.description-leave-to {
      opacity: 0;
    }

    @include breakpoint($sm-down) {
      @include size(685px, 300px);
      line-height: 20px;
      font-size: 13px;
    }

    @include breakpoint($xs) {
      @include size(350px, 360px);
      @include vh(margin-top, 15);
    }

    @include breakpoint($xs-height) {
      @include vh(margin-top, 8);
    }
  }
}
</style>
