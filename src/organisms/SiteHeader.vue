<template>
  <transition appear name="slide-from-top">
    <header class="header">
      <router-link class="header-title" :to="{name: 'Home', params: {language:$language.current}}">MONOGRID Boilerplate</router-link>
      <transition appear name="slide-from-right">
        <NavigationMenu class="nav"></NavigationMenu>
      </transition>
    </header>
  </transition>
</template>

<script>
import NavigationMenu from '@/molecules/NavigationMenu'

export default {
  name: 'SiteHeader',
  components: {
    NavigationMenu
  },

  mounted: function () {

  },

  methods: {

  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'mixins';
@import 'breakpoints';
@import 'z-index';

.header {
  position: fixed;
  width: 100%;
  background-color: $c-navy;
  padding: 1rem 2rem;
  box-sizing: border-box;
  display: table;

  z-index: $z-header-footer;

  @include breakpoint($xs) {
    padding: 0.5rem 1rem;
  }
}

.header-title {
  font-size: 1.5rem;
  display: table-cell;
  vertical-align: middle;
  width: 10%;
  white-space: nowrap;
  @include breakpoint($xs) {
    font-size: 1rem;
  }
}

.nav {
  display: table-cell;
  vertical-align: middle;
  text-align: right;
}

.slide-from-top-enter {
  transform: translateY(-100%);
}
.slide-from-top-enter-active {
  transition: transform 0.5s;
}

.slide-from-right-enter {
  transform: translate(200%);
}
.slide-from-right-enter-active {
  transition: transform 0.5s ease 0.5s;
}

</style>
