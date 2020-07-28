'use strict';

(!window.navigator.userAgent.match(/Trident\//i) &&
 !/Edge\/\d+/i.test(window.navigator.userAgent)  &&
 !window.navigator.userAgent.match(/MSIE /i)
)
  ? document.children[0].className = ''
  : document.execCommand('Stop');

if (/PhantomJS/.test(window.navigator.userAgent)) {
  document.children[0].className = '';
}
