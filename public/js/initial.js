'use strict';

(!!window.navigator.userAgent.match(/Trident\//i) || !!window.navigator.userAgent.match(/MSIE /i))
  ? (document.documentElement.className += ' ms-ie', document.execCommand('Stop'))
  : document.documentElement.className = '';

if (/PhantomJS/.test(window.navigator.userAgent)) {
  document.documentElement.className = '';
}
