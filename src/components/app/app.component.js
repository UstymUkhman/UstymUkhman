import { Component, ElementRef } from '@angular/core';
import { SoundsService         } from '../../services/sounds.service';
import { LoadingService        } from '../../services/loading.service';


@Component({
  selector: 'app',
  template: `
    <span id="loading-message" *ngIf="!ready">Loading</span>
    <router-outlet></router-outlet>
  `
})


export class AppComponent {
  constructor(app, sounds, loading) {
    this.interval = 1000;
    this.ready    = false;
    this.audio    = sounds;
    this.load     = loading;
    this.app      = app.nativeElement;
  }

  showNext() {
    if (this.interval > 3000) {
      clearInterval(this.loading);
      this.compleateLoading();
    }

    this.loadingMessage.textContent += '.';
    this.interval += 1000;
  }

  compleateLoading() {
    this.ready = true;
    this.audio.playMusic();
    this.load.finishLoading();
  }

  ngAfterViewInit() {
    this.loadingMessage = this.app.children[0];
    this.loading = setInterval(this.showNext.bind(this), 1000);
  }

  static get parameters() {
    return [
      [ElementRef],
      [SoundsService],
      [LoadingService]
    ];
  }
}
