<template>
  <div class="main-window">
    <Preloader v-if="loading" @load:site="$emit('show:overlay')" />

    <div class="console">
      <WrittenMessage v-if="loading && !showMenu" @ready:console="showMenu = true" />
      <SiteMenu v-if="loading && showMenu" :activeItem="lastActiveItem" />
    </div>
  </div>
</template>

<script>
import WrittenMessage from '@/atoms/WrittenMessage'
import Preloader from '@/atoms/Preloader'
import SiteMenu from '@/organisms/SiteMenu'
import Loading from '@/services/Loading'

export default {
  name: 'Console',

  components: {
    WrittenMessage,
    Preloader,
    SiteMenu
  },

  data () {
    return {
      lastActiveItem: Loading.getActiveItem(),
      showMenu: false,
      loading: true
    }
  },

  mounted () {
    this.loading = this.lastActiveItem === false

    if (!this.loading) {
      this.$emit('show:overlay')
      this.showMenu = true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';

.main-window {
  position: absolute;
  overflow: hidden;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}

.console {
  padding-left: 50px;
  padding-top: 75px;

  height: 100%;
  width: 100%;

  // background-color: $black;
  z-index: 1;

  @include breakpoint($sm-down) {
    width: auto;
  }

  @include breakpoint($xs) {
    padding-left: 25px;
    padding-top: 50px;
  }
}
</style>
