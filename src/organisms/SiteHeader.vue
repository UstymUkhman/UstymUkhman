<template>
  <header @mouseover="isHovered = visible = true" @mouseout="isHovered = visible = false"
          itemtype="https://schema.org/WPHeader" itemscope
          class="header" :class="{'scrollable': scroll}">

    <transition appear name="header">
      <div v-show="visible" class="header-container">
        <PageTitle :title="experiment.name" />

        <HeaderButtons
          :showDownload="'code' in experiment"
          @download="downloadExperiment"
          :repo="experiment.github"
          v-if="experiment"
        />
      </div>
    </transition>

    <div class="header-trigger" :class="{'active': activeTrigger}"></div>
  </header>
</template>

<script>
import HeaderButtons from '@/molecules/HeaderButtons'
import PageTitle from '@/atoms/PageTitle'

export default {
  name: 'SiteHeader',

  components: {
    HeaderButtons,
    PageTitle
  },

  props: {
    experiment: {
      type: Object,
      default: null,
      required: false
    },

    scroll: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      visible: true,
      isHovered: false,
      activeTrigger: false
    }
  },

  watch: {
    visible (now) {
      if (now) {
        this.activeTrigger = false
      } else {
        setTimeout(() => { this.activeTrigger = true }, 500)
      }
    }
  },

  methods: {
    downloadExperiment () {
      window.open(this.experiment.code, '_blank')
    }
  },

  mounted () {
    setTimeout(() => { this.visible = this.isHovered }, 2500)
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.header {
  position: fixed;
  z-index: $top;

  line-height: 80px;
  height: 80px;
  width: 100%;

  left: 0;
  top: 0;

  &.scrollable {
    width: calc(100% - 5px);
  }

  .header-container {
    background-image: linear-gradient($black, rgba($black, 0.9));
    height: 100%;
    width: 100%;
  }

  .header-trigger {
    pointer-events: none;
    position: absolute;

    height: 100%;
    width: 100%;

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

.header-enter,
.header-leave-to {
  transform: translateY(-100%);
}
</style>
