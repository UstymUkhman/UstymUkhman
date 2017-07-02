import {Component} from '@angular/core';

@Component({
  inputs: ['ready'],
  selector: 'screen-overlay',
  template: `<div class="screen-overlay" [ngClass]="{'ready': show}"></div>`
})


export class ScreenOverlayComponent {
  constructor() {
    this.show   = false;
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
  }

  ngOnChanges() {
    this.show = this.ready;
  }
}
