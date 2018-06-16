<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="contact-me-page">
    <transition appear name="fade-out">
      <PageList v-if="visibleAreas"
        cursor=">"
        :emailIndex="3"
        :urls="contacts"
        :activeBack.sync="activeBack"

        @update:index="activePage = $event + 1"
        @show:components="showComponents"
        @remove:pages="goToMenu = true"
        class="contacts-list"
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
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import ExternalPages from '@/mixins/ExternalPages'

export default {
  name: 'Contacts',

  mixins: [ExternalPages, FirePrerenderEvent],

  metaInfo: {
    title: 'Contacts |'
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.contact-me-page {
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
    padding: 0;
  }

  .contacts-list {
    position: absolute;
    margin: auto;

    bottom: auto;
    top: 50%;

    @include breakpoint($sm-down) {
      margin: 5vh 0 0 50px;
      height: 100%;
    }

    @include breakpoint($xs) {
      margin-left: 25px;
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
