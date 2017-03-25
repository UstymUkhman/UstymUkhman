import { Component, ElementRef } from '@angular/core';
import { LoadingService        } from '../../services/loading.service';


@Component({
  selector: 'app',
  template: `
    <span *ngIf="!ready">Loading</span>
    <router-outlet></router-outlet>
  `
})


export class AppComponent {
  constructor(app, loading) {
    this.interval = 1000;
    this.ready    = false;
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
    this.load.finishLoading();

    let song = new Audio('assets/music.mp3');
    song.autoplay = true;
    song.volume = 0.1;
    song.loop = true;
    song.load();
  }

  ngAfterViewInit() {
    this.loadingMessage = this.app.children[0];
    this.loading = setInterval(this.showNext.bind(this), 1000);
  }

  static get parameters() {
    return [[ElementRef], [LoadingService]];
  }
}
