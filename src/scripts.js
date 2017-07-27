const ie10  = Function('/*@cc_on return document.documentMode===10@*/')();

if (ie10) document.getElementById('ie10').style.display = 'block';
if (!!document.getElementById('error') || ie10) window.stop();

import 'babel-polyfill';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule              } from './components/app/app.module';

window.isMobile = true; // navigator.userAgent.toLocaleLowerCase().includes('mobile');
platformBrowserDynamic().bootstrapModule(AppModule);
