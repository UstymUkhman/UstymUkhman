const isIE = navigator.userAgent.indexOf('MSIE ')    > -1 ||
             navigator.userAgent.indexOf('Trident/') > -1;

if (isIE) document.getElementById('msie').style.display = 'block';


import 'babel-polyfill';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule              } from './components/app/app.module';
import { enableProdMode         } from '@angular/core';


window.isMobile = !!navigator.userAgent.match(/iPad/i)
               || !!navigator.userAgent.match(/iPod/i)
               || !!navigator.userAgent.match(/webOS/i)
               || !!navigator.userAgent.match(/iPhone/i)
               || !!navigator.userAgent.match(/Android/i)
               || !!navigator.userAgent.match(/BlackBerry/i)
               || !!navigator.userAgent.match(/Windows Phone/i);

if (!isIE) {
  enableProdMode();
  platformBrowserDynamic().bootstrapModule(AppModule);
}
