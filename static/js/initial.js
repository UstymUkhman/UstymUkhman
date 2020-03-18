var html = window.document.getElementById('html-element');

if (/PhantomJS/.test(window.navigator.userAgent)) {
  html.className = 'no-js';
} else {
  html.className = html.className.split('no-js').join('');
}
