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

      selectedBack: false,
      activeBack: false,
      showBack: false
    }
  },

  methods: {
    showComponents () {
      this.showRain = true
      this.showBack = true
    }
  }
}
