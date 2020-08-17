<template>
  <article itemtype="http://schema.org/ContactPage" class="contacts-page" itemscope>
    <LinksList
      v-model:selectedBack="selectedButton"
      v-model:activeBack="activeButton"
      @show-components="showComponents"
      v-model:skip="lettering"
      class="contact-links"
      :dispose="closePage"
      :urls="contacts"
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
import { Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import BackButton from '@components/BackButton.vue'
import Contacts from '@/assets/data/contacts.json'
import LinksList from '@components/LinksList.vue'
import { firePrerender } from '@/utils'

interface TemplateValues {
  readonly showComponents: () => void
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly lettering: Ref<boolean>
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
    const selectedButton: Ref<boolean> = ref(false)
    const visibleButton: Ref<boolean> = ref(false)
    const activeButton: Ref<boolean> = ref(false)
    const lettering: Ref<boolean> = ref(false)
    const closePage: Ref<boolean> = ref(false)

    function removeSkipEvent (): void {
      document.removeEventListener('touchend', skipLettering, false)
      document.removeEventListener('keyup', skipLettering, false)
    }

    function showComponents (): void {
      setTimeout(() => { visibleButton.value = true }, 500)
    }

    function skipLettering (): void {
      if (!lettering.value) {
        lettering.value = true
        removeSkipEvent()
      }
    }

    onMounted(() => {
      document.addEventListener('touchend', skipLettering, false)
      document.addEventListener('keyup', skipLettering, false)
      firePrerender({ title: 'Contacts' })
    })

    onBeforeUnmount(removeSkipEvent)

    return {
      contacts: Contacts as Array<Page>,
      showComponents,
      selectedButton,
      visibleButton,
      activeButton,
      lettering,
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
