<template>
  <header itemtype="https://schema.org/WPHeader" itemscope
          class="header" :class="{'scrollable': scroll}"
          @mouseover="toggleVisibility(false)"
          @mouseout="toggleVisibility(true)">

    <transition name="header" appear>
      <div v-show="visible" class="header-container">
        <ExperimentTitle :title="title" />
        <!-- <ExperimentButtons :github="github" /> -->
      </div>
    </transition>

    <div class="header-trigger" :class="{'active': trigger}"></div>
  </header>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Ref, defineComponent, watchEffect, onMounted, ref } from 'vue'
import ExperimentButtons from '@components/ExperimentButtons.vue'
import ExperimentTitle from '@components/ExperimentTitle.vue'

interface TemplateValues {
  readonly toggleVisibility: Function
  readonly trigger: Ref<boolean>
  readonly visible: Ref<boolean>
  readonly hover: Ref<boolean>
}

export default defineComponent({
  name: 'ExperimentHeader',

  components: {
    ExperimentButtons,
    ExperimentTitle
  },

  props: {
    title: {
      required: true,
      type: String
    },

    github: {
      required: true,
      type: String
    },

    scroll: {
      required: false,
      default: false,
      type: Boolean
    }
  },

  setup (props): TemplateValues {
    function toggleVisibility (hidden: boolean): void {
      if (hidden && trigger.value) return
      const now = Date.now()

      if (now - interaction > 500) {
        visible.value = !hidden
        hover.value = !hidden
        interaction = now
      }
    }

    const trigger: Ref<boolean> = ref(false)
    const visible: Ref<boolean> = ref(true)
    const hover: Ref<boolean> = ref(false)
    let interaction: number = Date.now()

    watchEffect(() => { trigger.value = !visible.value })

    onMounted(() => {
      setTimeout(() => {
        visible.value = hover.value
        interaction = Date.now()
      }, 2500)
    })

    return {
      toggleVisibility,
      trigger,
      visible,
      hover
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'mixins';

.header {
  @include size(100%, 80px);
  line-height: 80px;

  position: fixed;
  z-index: $top;

  left: 0;
  top: 0;

  &.scrollable {
    width: calc(100% - 5px);
  }

  .header-container {
    background-image: linear-gradient($black, rgba($black, 0.9));
    @include size;
  }

  .header-trigger {
    @include absolute-size;
    pointer-events: none;

    &.active {
      pointer-events: all;
    }

    @include breakpoint($sm-down) {
      display: none;
    }
  }

  @include breakpoint($xs) {
    line-height: 50px;
    height: 50px;
  }

  .title-container {
    pointer-events: none;
    width: 50%;
  }

  .buttons-container {
    width: 50%;
  }
}

.header-enter-active {
  transition: transform 0.5s $ease-out-quad;
}

.header-leave-active {
  transition: transform 0.5s $ease-in-quad;
}

.header-enter-from,
.header-leave-to {
  transform: translateY(-100%);
}
</style>
