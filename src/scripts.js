const isIE = navigator.userAgent.indexOf('MSIE ')    > -1 ||
             navigator.userAgent.indexOf('Trident/') > -1;

if (isIE) document.getElementById('msie').style.display = 'block';


import 'babel-polyfill';

import { enableProdMode         } from '@angular/core';
import { AppModule              } from './components/app/app.module';
<<<<<<< HEAD
import { enableProdMode         } from '@angular/core';
=======
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
>>>>>>> a883f8e84ce22c428119fe35cb17575024a6c5d2


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
