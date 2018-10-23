import BackButton from '@/atoms/BackButton'
import PageList from '@/molecules/PageList'

export default {
  components: {
    BackButton,
    PageList
  },

  data () {
    return {
      skipLettering: false,
      selectedBack: false,
      activeBack: false,
      closePage: false,
      showBack: false
    }
  },

  methods: {
    showComponents () {
      setTimeout(() => {
        this.showBack = true
      }, 500)
    },

    onSkipLettering () {
      if (!this.skipLettering) {
        document.removeEventListener('touchend', this._onSkipLettering, false)
        document.removeEventListener('keyup', this._onSkipLettering, false)
        this.skipLettering = true
      }
    }
  },

  mounted () {
    this._onSkipLettering = this.onSkipLettering.bind(this)
    document.addEventListener('keyup', this._onSkipLettering, false)
    document.addEventListener('touchend', this._onSkipLettering, false)
  }
}
