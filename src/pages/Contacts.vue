<template>
  <article itemtype="http://schema.org/ContactPage" class="contacts-page" itemscope>
    <LinksList
      v-model:selectedBack="selectedButton"
      v-model:activeBack="activeButton"
      @show-button="showBackButton"
      class="contact-links"
      :dispose="closePage"
      :links="contacts"
      contacts
    />

    <BackButton
      @close-page="closePage = true"
      :enabled="selectedButton"
      :focused="activeButton"
      v-if="visibleButton"
    />
  </article>
</template>

<script lang="ts">
import { Ref, defineComponent, ref, onMounted } from 'vue'
import BackButton from '@components/BackButton.vue'
import Contacts from '@/assets/data/contacts.json'
import LinksList from '@components/LinksList.vue'
import { firePrerender } from '@/utils'

interface TemplateValues {
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly showBackButton: () => void
  readonly closePage: Ref<boolean>
  readonly contacts: Array<Page>
}

export default defineComponent({
  name: 'Contacts',

  components: {
    BackButton,
    LinksList
  },

  setup (): TemplateValues {
    function showBackButton (): void {
      setTimeout(() => visibleButton.value = true, 500)
    }

    const selectedButton = ref(false)
    const visibleButton = ref(false)
    const activeButton = ref(false)
    const closePage = ref(false)

    onMounted(() => firePrerender({ title: 'Contacts' }))

    return {
      contacts: Contacts as Array<Page>,
      showBackButton,
      selectedButton,
      visibleButton,
      activeButton,
      closePage
    }
  }
})
</script>

<style lang="scss" scoped>
.contacts-page {
  @include center-size;
  padding-left: 100px;

  overflow: hidden;
  z-index: 2;

  @include breakpoint($md) {
    padding-left: 50px;
  }

  @include breakpoint($sm-down) {
    padding: 0;
  }

  .contact-links {
    position: absolute;
    margin: auto;
    bottom: auto;

    ::v-deep(ul) {
      top: 50%;
    }

    @include breakpoint($sm-down) {
      margin: 0 0 0 50px;
      height: 100%;
    }

    @include breakpoint($xs) {
      margin-left: 25px;
    }
  }
}
</style>
