import CanvasMatrixCode from '@/molecules/CanvasMatrixCode'
import BackButton from '@/atoms/BackButton'
import PageList from '@/molecules/PageList'

import Projects from '@/assets/data/projects'
import Contacts from '@/assets/data/contacts'

import { mobile } from '@/_variables.scss'
import Viewport from '@/mixins/Viewport'

export default {
  mixins: [Viewport],

  components: {
    CanvasMatrixCode,
    BackButton,
    PageList
  },

  data () {
    return {
      projects: Projects,
      contacts: Contacts,

      visibleAreas: true,
      activeBack: false,

      showBack: false,
      goToMenu: false,
      showRain: false
    }
  },

  watch: {
    goToMenu (now) {
      if (now) {
        setTimeout(() => {
          this.visibleAreas = false
        }, 3500)
      }
    }
  },

  computed: {
    rainRatio () {
      return this.viewPort.width < mobile ? 1 : 2.25
    }
  },

  methods: {
    showComponents () {
      this.showRain = true
      this.showBack = true
    }
  }
}
