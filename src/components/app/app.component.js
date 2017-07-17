import { Component      } from '@angular/core';
import { SoundsService  } from '../../services/sounds.service';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
  `
})


export class AppComponent {
  constructor(sounds, loading) {
    this.audio   = sounds;
    this.loading = loading;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.audio.playMusic();
      this.loading.finishLoading();
    }, 500);
  }

  static get parameters() {
    return [[SoundsService], [LoadingService]];
  }
}
