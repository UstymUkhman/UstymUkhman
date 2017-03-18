import {Component} from '@angular/core';

@Component({
  inputs: ['ready'],
  selector: 'screen-overlay',
  template: `
    <div id="screen-overlay"
         [ngClass]="show">
    </div>
  `
})


export class ScreenOverlayComponent {
  constructor() {
    this.show    = '';
    this.width   = window.innerWidth;
    this.height  = window.innerHeight;
  }

  ngOnChanges() {
    if (this.ready) {
      this.show = 'console-ready';
    }
  }
}
