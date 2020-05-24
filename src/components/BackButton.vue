<template>
  <div class="back-button">
    <div @touchstart="onTouchStart" @touchend="onTouchEnd" class="back-button-container">
      <div class="button-border">
        <div class="button-box" :class="{'active': active, 'pressed': pressed, 'selected': selected || (active && touching)}">

          <div class="button-background"></div>
          <p ref="button" class="button back" :class="{'active': active}">&lt; b@cK</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { SetupContext, Ref, defineComponent, watch, watchEffect, onMounted, ref } from 'vue'
import { TouchEventListener, VueRef, Lettering, Loading, Platform } from '@/utils'
/* eslint-enable no-unused-vars */
import router from '@/router'

interface TemplateValues {
  readonly button: Ref<HTMLParagraphElement>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly selected: VueRef<boolean>
  readonly pressed: VueRef<boolean>
  readonly active: VueRef<boolean>
  readonly touching: Ref<boolean>
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
      touching.value = true
      pressed.value = true
      back = true
    }

    function onTouchEnd (event: TouchEvent): void {
      const delay = !props.active ? 800 : 0
      touching.value = false
      pressed.value = false

      context.emit('close:page')
      lettering.dispose()

      setTimeout(() => {
        Loading.checkActiveItem()
        router.push({ name: 'SiteMenu' })
      }, delay + 2500)
    }

    const selected: VueRef<boolean> = ref(props.selected)
    const pressed: VueRef<boolean> = ref(props.selected)
    const active: VueRef<boolean> = ref(props.active)

    const button: Ref<HTMLParagraphElement> = ref()!
    const touching: Ref<boolean> = ref(false)

    let back: boolean = false
    let lettering: Lettering

    watchEffect(() => { selected.value = props.selected })
    watchEffect(() => { active.value = props.active })

    watch(() => props.selected, (now, before): void => {
      pressed.value = true

      if (before && !now) {
        setTimeout(() => {
          active.value = false
          lettering.dispose()
        }, 500)

        setTimeout(() => {
          Loading.checkActiveItem()
          router.push({ name: 'SiteMenu' })
        }, 3000)
      }
    })

    onMounted(() => {
      lettering = new Lettering(button.value, 100)

      lettering.animate((): void => {
        active.value = !back && (active.value || Platform.mobile)
      })
    })

    return {
      onTouchStart,
      onTouchEnd,
      touching,
      selected,
      pressed,
      active,
      button
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.back-button {
  @include center-size;
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
      @include white-rabbit(25px);
      padding: 0 10% 0 30%;
      line-height: 50px;

      @include breakpoint($sm-down) {
        padding-left: 25%;
        line-height: 42px;
        font-size: 20px;
      }
    }
  }
}
</style>
