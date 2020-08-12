<template>
  <article @touchstart="onTouchStart" @touchend="onTouchEnd" itemtype="http://schema.org/AboutPage" class="about-page" itemscope>
    <p ref="paragraph" itemprop="text" class="about-description">{{ description }}</p>

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
import { Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import BackButton from '@components/BackButton.vue'

interface TemplateValues {
  readonly paragraph: Ref<HTMLParagraphElement>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly closeAboutPage: () => void
  readonly description: string
}

export default defineComponent({
  name: 'About',

  components: {
    BackButton
  },

  setup (): TemplateValues {
    function enterKey (event: KeyboardEvent | TouchEvent): boolean {
      return event instanceof KeyboardEvent && event.keyCode === 13
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
      lettering.dispose()
    }

    const description = `
      Hi, my name is Ustym and I'm a front-end web developer.#
      I'm working on too many things, trying to hack time to get more than 24 hours a day.#
      I studied and lived in Florence (Italy) for 14 years and recently I moved to Kiev (Ukraine).##

      Things I love:#
      %- Learning and using new web technologies#
      %- JavaScript, TypeScript, Vue.js & WebGL#
      %- Cinema, music, games, coffee & cats##

      Things I hate:#
      %- Internet Explorer#
      %- Social Networks#
      %- Dirty code#
      %- Mondays#
    `

    const paragraph: Ref<HTMLParagraphElement> = ref()!
    const selectedButton: Ref<boolean> = ref(false)
    const visibleButton: Ref<boolean> = ref(false)
    const activeButton: Ref<boolean> = ref(false)

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
      description,
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
    @include center-size(1050px, 395px);
    @include white-rabbit;

    position: absolute;
    line-height: 28px;

    &.description-leave-active {
      transition: opacity 1s linear 3.5s;
    }

    &.description-leave-to {
      opacity: 0;
    }

    @include breakpoint($md-down) {
      width: 900px;
    }

    @include breakpoint($sm-down) {
      @include size(75vw, 360px);
      line-height: 20px;
      font-size: 13px;
    }

    @include breakpoint($xs) {
      margin-top: 15vh;
      width: 95vw;
    }

    @media only screen and (max-height: 550px) {
      margin-top: 0;
    }
  }
}
</style>
