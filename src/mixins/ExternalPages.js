import BackButton from '@/atoms/BackButton'
import PageList from '@/molecules/PageList'

import Projects from '@/assets/data/projects'
import Contacts from '@/assets/data/contacts'

export default {
  components: {
    BackButton,
    PageList
  },

  data () {
    return {
      projects: Projects,
      contacts: Contacts,

      activeBack: false,
      showBack: false,
      goToMenu: false
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
