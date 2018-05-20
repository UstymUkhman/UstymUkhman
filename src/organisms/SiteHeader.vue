<template>
  <transition appear name="header">
    <header class="header" :class="{'scrollable': scroll}">
      <PageTitle :title="page" />

      <HeaderButtons
        v-if="currentExperiment"
        :repo="currentExperiment.github"
        :showDownload="'code' in currentExperiment"
        @download="downloadExperiment" />
    </header>
  </transition>
</template>

<script>
import Experiments from '../assets/data/experiments.json'
import find from 'lodash/find'

import HeaderButtons from '@/molecules/HeaderButtons'
import PageTitle from '@/atoms/PageTitle'

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
    }
  },

  data () {
    return {
      currentExperiment: null,
      experiments: Experiments
    }
  },

  methods: {
    downloadExperiment () {
      window.open(this.currentExperiment.code, '_blank')
    }
  },

  mounted () {
    this.currentExperiment = find(this.experiments, { name: this.page })
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';
@import 'z-index';

.header {
  background-image: linear-gradient($black, rgba($black, 0.9));
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

.header-enter,
.header-leave-to {
  transform: translateY(-100%);
}

.header-enter-active,
.header-leave-active {
  transition: transform 0.5s ease-out 0.5s;
}
</style>
