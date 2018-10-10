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
        document.removeEventListener('touchstart', this._onSkipLettering, false)
        document.removeEventListener('keydown', this._onSkipLettering, false)
        this.skipLettering = true
      }
    }
  },

  mounted () {
    this._onSkipLettering = this.onSkipLettering.bind(this)
    document.addEventListener('keydown', this._onSkipLettering, false)
    document.addEventListener('touchstart', this._onSkipLettering, false)
  }
}
