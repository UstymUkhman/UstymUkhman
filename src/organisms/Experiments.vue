<template>
  <div itemtype="http://schema.org/WebPageElement" itemscope class="experiments" v-scroll-container:experiments>
    <div v-for="(experiment, e) in experiments" :key="experiment.name"
         class="experiment" :class="{'right': !!(e % 2)}"
         :style="{'height': previewHeight + 'px'}"
         v-scroll-element:experiments>

      <ExperimentPreview
        :route="experiment.route"
        :name="experiment.name"
        :right="!!(e % 2)"
        itemprop="xpath"
        :key="e"
      />

    </div>
  </div>
</template>

<script>
import ExperimentPreview from '@/molecules/ExperimentPreview'
import Experiments from '@/assets/data/experiments'

import { mobile } from '@/_variables.scss'
import Viewport from '@/mixins/Viewport'

export default {
  name: 'Experiments',

  mixins: [Viewport],

  components: {
    ExperimentPreview
  },

  data () {
    return {
      experiments: Experiments
    }
  },

  computed: {
    previewHeight () {
      const _width = this.viewPort.width
      const width = (_width < mobile) ? _width : _width / 2

      return width / 16 * 9
    }
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.experiments {
  overflow-x: hidden;
  overflow-y: auto;
}

.experiment {
  transition: transform 0.8s $ease-out-quart, opacity 0.5s 0.2s;
  transform: translateX(-100%);

  display: inline-block;
  position: relative;

  opacity: 0;
  width: 50%;

  &.right {
    transform: translateX(100%);
  }

  &.in-view {
    transform: translateX(0);
    opacity: 1;
  }

  @include breakpoint($sm-down) {
    transition: transform 0.5s $ease-out-quart, opacity 0.3s 0.1s;
    transform: translateY(100%);

    display: block;
    width: 100%;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        transition: none;
      }
    }

    &:last-child {
      margin-bottom: 20px;
    }

    &.right {
      transform: translateY(100%);
    }

    &.in-view {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
