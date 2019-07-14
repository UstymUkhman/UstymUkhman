<template>
  <article itemtype="http://schema.org/ContactPage" itemscope class="contact-me-page">
    <PageList
      contacts
      :urls="contacts"
      :dispose="closePage"
      :activeBack.sync="activeBack"
      :selectedBack.sync="selectedBack"
      :skipLettering.sync="skipLettering"
      @show:components="showComponents"
      class="contacts-list"
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
import Contacts from '@/assets/data/contacts'

export default {
  name: 'Contacts',

  mixins: [ExternalPages, FirePrerenderEvent],

  data () {
    return {
      contacts: Contacts
    }
  },

  metaInfo: {
    title: 'Contacts |'
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.contact-me-page {
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

    .list-container {
      top: 50%;
    }

    @include breakpoint($sm-down) {
      margin: 0;
      height: 100%;
      margin-left: 50px;
    }

    @include breakpoint($xs) {
      margin-left: 25px;
    }
  }
}
</style>
