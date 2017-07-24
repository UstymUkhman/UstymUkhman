import 'babel-polyfill';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule              } from './components/app/app.module';


window.isMobile = true; // navigator.userAgent.toLocaleLowerCase().includes('mobile');
platformBrowserDynamic().bootstrapModule(AppModule);
