<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="my-works-page" :class="{'small-list': projects.length < 6}">
    <transition appear>
      <div v-if="visibleCounter" class="works-counter">
        <span>{{ activePage }} / {{ projects.length }}</span>
      </div>
    </transition>

    <PageList
      :urls="projects"
      :dispose="closePage"
      :activeBack.sync="activeBack"
      :selectedBack.sync="selectedBack"
      :skipLettering.sync="skipLettering"
      @update:index="activePage = $event + 1"
      @show:components="showComponents"
      class="projects-list"
    />

    <BackButton
      v-if="showBack"
      :active="activeBack"
      :selected="selectedBack"
      @close:page="closePage = true"
    />
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import ExternalPages from '@/mixins/ExternalPages'

import Projects from '@/assets/data/projects'
import Platform from '@/platform'

export default {
  name: 'Works',

  mixins: [ExternalPages, FirePrerenderEvent],

  data () {
    return {
      projects: Projects,
      activePage: 1
    }
  },

  computed: {
    visibleCounter () {
      return !Platform.mobile && !this.activeBack && this.projects.length > 5
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
  position: absolute;
  overflow: hidden;
  z-index: 2;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($sm-down) {
    overflow: visible;
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
