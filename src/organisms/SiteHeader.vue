<template>
  <header @mouseover="visible = true" class="header" :class="{'scrollable': scroll}">
    <transition appear name="header">
      <div v-show="visible" @mouseout="onMouseOut" class="header-container">
        <PageTitle :title="page" />

        <HeaderButtons
          :showDownload="'code' in currentExperiment"
          :repo="currentExperiment.github"
          @download="downloadExperiment"
          v-if="currentExperiment"
        />
      </div>
    </transition>

    <div class="header-trigger" @mouseout="onMouseOut" :class="{'hidden': visible}"></div>
  </header>
</template>

<script>
import Experiments from '../assets/data/experiments.json'
import HeaderButtons from '@/molecules/HeaderButtons'
import PageTitle from '@/atoms/PageTitle'

import Platform from '@/platform'
import find from 'lodash.find'

export default {
  name: 'SiteHeader',

  components: {
    HeaderButtons,
    PageTitle
  },

  props: {
    page: {
      type: String,
      default: null,
      required: false
    },

    scroll: {
      type: Boolean,
      default: false,
      required: false
    },

    experiment: {
      type: Object,
      default: null,
      required: false
    }
  },

  data () {
    return {
      experiments: Experiments,
      visible: !Platform.mobile,
      currentExperiment: this.experiment
    }
  },

  watch: {
    experiment () {
      this.currentExperiment = this.experiment
    }
  },

  methods: {
    downloadExperiment () {
      window.open(this.currentExperiment.code, '_blank')
    },

    onMouseOut () {
      setTimeout(() => { this.visible = false }, 500)
    }
  },

  mounted () {
    this.currentExperiment = find(this.experiments, { name: this.page })
    setTimeout(() => { this.visible = !this.visible }, 2500)
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
    pointer-events: all;
    position: absolute;

    height: 100%;
    width: 100%;

    &.hidden {
      pointer-events: none;
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
