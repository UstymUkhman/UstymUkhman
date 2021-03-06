<template>
  <div class="back-button">
    <div @touchstart.once="onTouchStart" @touchend.once="onTouchEnd" class="back-button-container">
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
import { SetupContext, Ref, defineComponent, watch, watchEffect, ref, onMounted } from 'vue'
import { TouchEventListener, Lettering, Loading, Platform } from '@/utils'
import router from '@/router'

interface TemplateValues {
  readonly button: Ref<HTMLParagraphElement>
  readonly onTouchStart: TouchEventListener
  readonly onTouchEnd: TouchEventListener
  readonly touching: Ref<boolean>
  readonly selected: Ref<boolean>
  readonly pressed: Ref<boolean>
  readonly active: Ref<boolean>
}

export default defineComponent({
  name: 'BackButton',

  props: {
    focused: {
      type: Boolean,
      default: false,
      required: false
    },

    enabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  setup (props, context: SetupContext): TemplateValues {
    function onTouchStart (): void {
      touching.value = true
      pressed.value = true
      back = true
    }

    function onTouchEnd (): void {
      active.value = !back && !Platform.mobile
      const delay = !props.focused ? 800 : 0

      context.emit('close-page')
      lettering.dissolve()

      touching.value = false
      pressed.value = false

      setTimeout(() => {
        Loading.checkActiveItem()
        router.push({ name: 'Home' })
      }, delay + 2500)
    }

    const selected = ref(props.enabled)
    const pressed = ref(props.enabled)
    const active = ref(props.focused)

    const touching = ref(false)
    let lettering: Lettering
    const button = ref()
    let back = false

    watchEffect(() => { active.value = props.focused })

    watch(() => props.enabled, (now, before): void => {
      selected.value = now
      pressed.value = true

      if (before && !now) {
        setTimeout(() => {
          active.value = false
          lettering.dissolve()
        }, 500)

        setTimeout(() => {
          Loading.checkActiveItem()
          router.push({ name: 'Home' })
        }, 3000)
      }
    })

    onMounted(() => {
      lettering = new Lettering(button.value, 100)

      lettering.animate(() => {
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

    @include breakpoint($xs-height) {
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
