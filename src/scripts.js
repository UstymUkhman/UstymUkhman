import 'babel-polyfill';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule              } from './components/app/app.module';


(() => {
  let interval    = 1000,
      loadMessage = document.getElementById('load-message'),

  loadTime = setInterval(() => {
    loadMessage.textContent += '.';

    if (interval > 2000) {
      // let song = new Audio('assets/music.mp3');
      // song.autoplay = true;
      // song.volume = 0.1;
      // song.loop = true;
      // song.load();

      clearInterval(loadTime);
      platformBrowserDynamic().bootstrapModule(AppModule);
    } else {
      interval += 1000;
    }
  }, 1000);
})();
