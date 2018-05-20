<template>
  <transition appear name="slide-in">
    <footer class="footer">
      <LanguageSwitcher class="language-switcher" @change="onLanguageChange" />
      <MarkdownBlock class="about" tag="span" :inline="true" :text="aboutText" />
    </footer>
  </transition>
</template>

<script>
import LanguageSwitcher from '@/molecules/LanguageSwitcher'
import MarkdownBlock from '@/atoms/MarkdownBlock'

export default {

  name: 'SiteFooter',

  components: {
    LanguageSwitcher,
    MarkdownBlock
  },

  methods: {
    onLanguageChange: function (val) {
      this.$router.push({
        name: this.$route.name,
        params: {
          language: val
        }
      })
    }
  },

  computed: {
    aboutText: function () {
      // displayed in the footer, about text
      return this.$gettext('Built with ♥ by [MONOGRID](http://www.mono-grid.com)')
    }
  }

}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'mixins';
@import 'breakpoints';
@import 'z-index';

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;

  z-index: $z-header-footer;

  box-sizing: border-box;
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: $c-navy;
  color: $c-white;

  @include breakpoint($xs) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

.language-switcher {
  display: inline-block;
}

.about {
  padding-left: 10px;
  padding-right: 10px;
}

.slide-in-enter-active {
  transition: transform 0.5s;
}

.slide-in-enter {
  transform: translateY(100%);
}

</style>
