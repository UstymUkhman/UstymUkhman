import platform from '@/platform'

export default function () {
  if (platform.prerender) {
    setTimeout(() => {
      document.dispatchEvent(new Event('custom-post-render-event'))
    }, 1000)
  }
}
