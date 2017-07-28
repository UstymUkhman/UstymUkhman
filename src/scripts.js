const ie10  = Function('/*@cc_on return document.documentMode===10@*/')();

if (ie10) document.getElementById('ie10').style.display = 'block';
if (!!document.getElementById('error') || ie10) window.stop();

import 'babel-polyfill';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule              } from './components/app/app.module';

window.isMobile = !!navigator.userAgent.match(/iPad/i)
               || !!navigator.userAgent.match(/iPod/i)
               || !!navigator.userAgent.match(/webOS/i)
               || !!navigator.userAgent.match(/iPhone/i)
               || !!navigator.userAgent.match(/Android/i)
               || !!navigator.userAgent.match(/BlackBerry/i)
               || !!navigator.userAgent.match(/Windows Phone/i);

platformBrowserDynamic().bootstrapModule(AppModule);
