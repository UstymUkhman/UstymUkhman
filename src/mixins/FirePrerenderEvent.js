import Platform from '@/platform'

export default {
  mounted: function () {
    if (Platform.prerenderer) {
      setTimeout(() => {
        document.dispatchEvent(new Event('custom-post-render-event'))
      }, 1000)
    }
  }
}
