<template>
  <article itemtype="http://schema.org/CollectionPage" class="works-page" itemscope>
    <transition appear>
      <div v-if="visibleCounter" class="works-counter">
        <span>{{ currentWork }} / {{ projects.length }}</span>
      </div>
    </transition>

    <LinksList
      @index-update="currentWork = $event + 1"
      v-model:selectedBack="selectedButton"
      v-model:activeBack="activeButton"
      @show-button="showBackButton"
      :dispose="closePage"
      :urls="projects"
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
import { Ref, ComputedRef, defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Platform, Viewport, firePrerender, mobileWidth } from '@/utils'
import BackButton from '@components/BackButton.vue'
import Projects from '@/assets/data/projects.json'
import LinksList from '@components/LinksList.vue'

interface TemplateValues {
  readonly visibleCounter: ComputedRef<boolean>
  readonly selectedButton: Ref<boolean>
  readonly visibleButton: Ref<boolean>
  readonly activeButton: Ref<boolean>
  readonly showBackButton: () => void
  readonly currentWork: Ref<number>
  readonly closePage: Ref<boolean>
  readonly projects: Array<Page>
}

export default defineComponent({
  name: 'Works',

  components: {
    BackButton,
    LinksList
  },

  setup () {
    const visibleCounter = computed(() =>
      !(Platform.mobile || screen.size.width < mobileWidth) && !activeButton.value
    )

    function showBackButton (): void {
      setTimeout(() => visibleButton.value = true, 500)
    }

    onMounted(() => firePrerender({ title: 'Works' }))

    onBeforeUnmount(() => screen.dispose())

    const selectedButton = ref(false)
    const visibleButton = ref(false)
    const activeButton = ref(false)

    const screen = new Viewport()
    const closePage = ref(false)
    const currentWork = ref(1)

    return {
      projects: Projects as Array<Page>,
      visibleCounter,
      showBackButton,
      selectedButton,
      visibleButton,
      activeButton,
      currentWork,
      closePage
    }
  }
})
</script>

<style lang="scss" scoped>
.works-page {
  @include center-size;
  overflow: hidden;

  @include breakpoint($sm-down) {
    overflow: hidden visible;
  }

  .works-counter {
    @include size(75px, 20px);
    white-space: nowrap;
    position: absolute;

    text-align: center;
    line-height: 24px;
    margin: auto;

    bottom: auto;
    top: 50px;
    right: 0;
    left: 0;

    @media only screen and (max-height: 550px) {
      top: 25px;
    }
  }
}
</style>
