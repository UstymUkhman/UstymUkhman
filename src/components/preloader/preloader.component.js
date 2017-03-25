import {Component} from '@angular/core';


@Component({
  inputs:   ['start'],
  selector: 'preloader',
  template: `<div class="fullscreen" [ngClass]="{'close': done}"></div>`
})


export class PreloaderComponent {
  constructor() {
    this.done = false;
  }

  ngOnChanges() {
    this.done = this.start;
  }
}
