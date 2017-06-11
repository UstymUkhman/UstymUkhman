import { Component, ElementRef } from '@angular/core';
import { SoundsService         } from '../../services/sounds.service';
import { LoadingService        } from '../../services/loading.service';


@Component({
  selector: 'app',
  // template: `
  //   <p id="loading-message" *ngIf="!ready">
  //     Loading<span *ngIf="!blink">_</span>
  //   </p>

  //   <router-outlet></router-outlet>
  // `

  template: `
    <router-outlet></router-outlet>
  `
})


export class AppComponent {
  constructor(app, sounds, loading) {
    this.interval = 250;
    this.blink    = true;
    this.ready    = false;
    this.audio    = sounds;
    this.load     = loading;
    this.app      = app.nativeElement;
  }

  showNext() {
    if (this.interval > 4000) {
      clearInterval(this.loading);
      this.compleateLoading();
    }

    this.blink = !this.blink;
    this.interval += 250;
  }

  compleateLoading() {
    this.ready = true;
    this.audio.playMusic();
    this.load.finishLoading();
  }

  ngAfterViewInit() {
    this.loadingMessage = this.app.children[0];
    this.loading = setInterval(this.showNext.bind(this), 250);
  }

  static get parameters() {
    return [
      [ElementRef],
      [SoundsService],
      [LoadingService]
    ];
  }
}
