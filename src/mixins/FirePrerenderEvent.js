import Platform from '@/platform'
//
//
// use this mixin when a page is included in the prerenderer paths
// this allows the pre-renderer to capture the page after 1 second it's mounted.
//
// A page not using this mixin will be captured anyways after a maximum of 10 seconds but it will slow down the build times
//
// USAGE:
//
// include this in the mixin objects of the page. That's it
//
//
export default {
  mounted: function () {
    if (Platform.prerenderer) {
      setTimeout(() => {
        document.dispatchEvent(new Event('custom-post-render-event'))
      }, 1000)
    }
  }
}
