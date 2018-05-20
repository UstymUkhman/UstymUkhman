import MatrixRain from '@/molecules/MatrixRain'
import BackButton from '@/atoms/BackButton'
import PageList from '@/molecules/PageList'

import Projects from '@/assets/data/projects'
import Contacts from '@/assets/data/contacts'

export default {
  components: {
    MatrixRain,
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

  methods: {
    showComponents () {
      this.showRain = true
      this.showBack = true
    }
  }
}
