var html = window.document.getElementById('html-element')
// check if browser is pre-renderer
if (/PhantomJS/.test(window.navigator.userAgent)) {
  // overwrite classes set by modernizr with initial one
  html.className = 'no-js'
} else {
  // remove no-js class immediately
  html.className = html.className.split('no-js').join('')
}
