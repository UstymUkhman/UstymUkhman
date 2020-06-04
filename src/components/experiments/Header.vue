<template>
  <header class="header" :class="{'scrollable': scroll}" itemtype="https://schema.org/WPHeader" itemscope
          @mouseover="toggleVisibility($event, true)" @mouseout="toggleVisibility($event, false)">

    <transition name="header" appear>
      <div v-show="visible" class="header-container">
        <Title :title="title" />
        <Buttons :description="description" :repository="github" />
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, ref } from 'vue'
import Buttons from '@components/experiments/Buttons.vue'
import Title from '@components/experiments/Title.vue'

type VisibilityCallback = (event: MouseEvent, show: boolean) => void

interface TemplateValues {
  readonly toggleVisibility: VisibilityCallback
  readonly visible: Ref<boolean>
  readonly hover: Ref<boolean>
}

export default defineComponent({
  name: 'Header',

  components: { Title, Buttons },

  props: {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    github: {
      type: String,
      required: true
    },

    scroll: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  setup (): TemplateValues {
    function toggleVisibility (event: MouseEvent, show: boolean): void {
      const target = event.relatedTarget as HTMLElement
      const button = target && target.tagName.toLowerCase() !== 'iframe'

      visible.value = show || button
      hover.value = show || button
    }

    const visible: Ref<boolean> = ref(true)
    const hover: Ref<boolean> = ref(false)

    onMounted(() => {
      setTimeout(() => {
        visible.value = hover.value
      }, 2500)
    })

    return {
      toggleVisibility,
      visible,
      hover
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  @include size(100%, 160px);
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
    @include size(100%, 50%);
  }

  @include breakpoint($xs) {
    line-height: 50px;
    height: 100px;
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
