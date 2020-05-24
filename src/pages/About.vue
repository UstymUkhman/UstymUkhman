<template>
  <article @touchstart="onTouchStart" @touchend="onTouchEnd"  itemtype="http://schema.org/AboutPage" itemscope class="about-page">
    <p ref="paragraph" itemprop="text" class="about-description">{{ description }}</p>

    <BackButton
      @close:page="closeAboutPage"
      :selected="selectedButton"
      :active="activeButton"
      v-if="visibleButton"
    />
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { SetupContext, Ref, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { TouchEventListener, Lettering, Loading, firePrerender } from '@/utils'
import BackButton from '@components/BackButton.vue'
/* eslint-enable no-unused-vars */

interface TemplateValues {
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly closeAboutPage: Function
  readonly description: string
  readonly paragraph: Ref
}

export default defineComponent({
  name: 'About',

  components: {
    BackButton
  },

  setup (props, context: SetupContext): TemplateValues {
    function enterKey (event: KeyboardEvent | TouchEvent): boolean {
      return event instanceof KeyboardEvent && event.keyCode === 13
    }

    function onKeyDown (event: KeyboardEvent | TouchEvent): void {
      if (activeButton.value && enterKey(event)) {
        selectedButton.value = true
      }

      if (!visibleButton.value) {
        context.emit('toggle:rain', true)
        lettering.skipLettering()
      }
    }

    function onKeyUp (event: KeyboardEvent | TouchEvent): void {
      if (activeButton.value && enterKey(event)) {
        closeAboutPage()
      }
    }

    function closeAboutPage (): void {
      context.emit('toggle:rain', false)
      selectedButton.value = false
      activeButton.value = false
      lettering.dispose()
    }

    const description: string = `
      Hi, my name is Ustym and I'm a front-end web developer at Sigma Software.#
      I studied and lived in Florence (Italy) for 14 years and recently I moved to Kiev (Ukraine).##

      Things I love:#
      %- Learning and using innovative web technologies#
      %- JavaScript in (almost) all its forms#
      %- CSS3 (and SCSS preprocessor)#
      %- Cat Videos, Music, Films & Coffee##

      Things I hate:#
      %- Internet Explorer#
      %- Social Networks#
      %- Dirty code#
      %- Mondays#
    `

    const selectedButton: Ref = ref(false)
    const visibleButton: Ref = ref(false)
    const activeButton: Ref = ref(false)

    const paragraph: Ref = ref()
    let lettering: Lettering

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)

      lettering = new Lettering(paragraph.value, 50)
      firePrerender({ title: 'About' })
      Loading.setActiveItem(0)

      lettering.animate(() => {
        setTimeout(() => { activeButton.value = true }, 1000)
        context.emit('toggle:rain', true)
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
@import 'mixins';

.about-page {
  background-color: rgba($black, 0.8);
  @include center-size;

  overflow: hidden;
  z-index: 3;

  @include breakpoint($md-down) {
    background-color: initial;
  }

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
