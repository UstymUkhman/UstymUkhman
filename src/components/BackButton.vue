<template>
  <div class="back-button">
    <div @touchstart="onTouchStart" @touchend="onTouchEnd" class="back-button-container">
      <div class="button-border">
        <div class="button-box" :class="{'active': active, 'pressed': pressed, 'selected': selected || (active && touching)}">

          <div class="button-background"></div>
          <p ref="text" class="button back" :class="{'active': active}">&lt; b@cK</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { SetupContext, Ref, defineComponent, watch, watchEffect, onMounted, ref } from 'vue'
import { TouchEventListener, Lettering, Loading, Platform } from '@/utils'
/* eslint-enable no-unused-vars */
import router from '@/router'

interface TemplateValues {
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly touching: boolean
  readonly selected: boolean
  readonly pressed: boolean
  readonly active: boolean
  readonly text: Ref
}

export default defineComponent({
  name: 'BackButton',

  props: {
    active: {
      required: false,
      default: false,
      type: Boolean
    },

    selected: {
      required: false,
      default: false,
      type: Boolean
    }
  },

  setup (props, context: SetupContext): TemplateValues {
    function onTouchStart (event: TouchEvent): void {
      touching = true
      pressed = true
      back = true
    }

    function onTouchEnd (event: TouchEvent): void {
      touching = false
      pressed = false
      let delay = 0

      if (!props.active) {
        active = !back && !isMobile
        delay = 800
      }

      lettering.dispose()
      context.emit('close:page')

      setTimeout(() => {
        Loading.checkActiveItem()
        router.push({ name: 'SiteMenu' })
      }, delay + 2500)
    }

    const isMobile: boolean = Platform.mobile as boolean
    const selected: boolean = props.selected as boolean
    let pressed: boolean = props.selected as boolean
    let active: boolean = props.active as boolean

    let touching: boolean = false
    let back: boolean = false

    let lettering: Lettering
    const text: Ref = ref()

    watchEffect(() => { active = props.active as boolean })

    watch(props.selected, (now, before) => {
      pressed = true

      if (before && !now) {
        setTimeout(() => {
          lettering.dispose()
          active = false
        }, 500)

        setTimeout(() => {
          Loading.checkActiveItem()
          router.push({ name: 'SiteMenu' })
        }, 3000)
      }
    })

    onMounted(() => {
      lettering = new Lettering(text.value, 100)
      lettering.animate((): void => { active = !back && (active || isMobile) })
    })

    return {
      onTouchStart,
      onTouchEnd,
      touching,
      selected,
      pressed,
      active,
      text
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.back-button {
  @include center-size;
  pointer-events: none;
  overflow: hidden;

  .back-button-container {
    @include size(150px, 50px);
    @include console-button;
    @include back-button;

    margin: 0 auto 25px;
    position: absolute;

    bottom: 0;
    right: 0;
    left: 0;

    @include breakpoint($sm-down) {
      @include size(120px, 40px);
      pointer-events: all;

      position: fixed;
      cursor: pointer;
    }

    @include breakpoint($xs) {
      @include console-button(2px);
    }

    @media only screen and (max-height: 550px) {
      margin-bottom: 10px;
    }

    .button-box {
      width: 150px;

      @include breakpoint($sm-down) {
        width: 100%;
      }
    }

    .button-background {
      @include size(150px, 50px);

      @include breakpoint($sm-down) {
        @include size;
      }
    }

    .button.back {
      @include white-rabbit;
      padding: 0 10% 0 30%;

      line-height: 50px;
      font-size: 25px;

      @include breakpoint($sm-down) {
        padding-left: 25%;
        line-height: 42px;
        font-size: 20px;
      }
    }
  }
}
</style>
