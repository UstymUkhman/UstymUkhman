<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="my-works-page" :class="{'small-list': projects.length < 6}">
    <transition appear>
      <div v-if="visibleCounter" class="works-counter">
        <span>{{ activePage }} / {{ projects.length }}</span>
      </div>
    </transition>

    <transition appear name="fade-out">
      <PageList
        v-if="visibleAreas"
        cursor="//"
        :urls="projects"
        :activeBack.sync="activeBack"

        @update:index="activePage = $event + 1"
        @show:components="showComponents"
        @remove:pages="goToMenu = true"
        class="projects-list"
      />
    </transition>

    <transition appear name="fade-out">
      <div v-if="visibleAreas && showRain" class="matrix-rain">
        <MatrixRain />
      </div>
    </transition>

    <BackButton v-if="showBack" :active="activeBack" :backToMenu.sync="goToMenu" />
  </article>
</template>

<script>
import ExternalPages from '@/mixins/ExternalPages'
import Platform from '@/platform'

export default {
  name: 'Works',

  mixins: [ExternalPages],

  data () {
    return {
      activePage: 1
    }
  },

  computed: {
    visibleCounter () {
      return !Platform.mobile && this.showRain && !this.activeBack && this.projects.length > 5
    }
  },

  metaInfo: {
    title: 'Works |'
  }
}
</script>

<style scoped lang="scss">
@import 'mixins';

.my-works-page {
  background-color: $black;
  padding-left: 100px;

  position: absolute;
  overflow: hidden;
  z-index: 2;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($md) {
    padding-left: 50px;
  }

  @include breakpoint($sm-down) {
    overflow: visible;
    padding-left: 0;
  }

  &.small-list {
    .projects-list {
      transition: opacity 1s;
      bottom: auto;
      top: 50%;
    }

    @include breakpoint($sm-down) {
      overflow: hidden;
    }
  }

  .works-counter {
    text-align: center;
    position: absolute;
    width: 100%;

    bottom: auto;
    right: auto;
    top: 50px;
    left: 0;

    span {
      @include white-rabbit;
    }

    @media only screen and (max-height: 550px) {
      top: 25px;
    }
  }

  .matrix-rain {
    pointer-events: none;
    position: absolute;

    height: 100%;
    width: 50%;

    right: auto;
    bottom: 0;
    left: 50%;
    top: 0;

    @include breakpoint($sm-down) {
      position: fixed;
      width: 100%;
      left: 0;
    }
  }
}
</style>
