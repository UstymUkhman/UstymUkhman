import {Component} from '@angular/core';


@Component({
  inputs:   ['start'],
  selector: 'preloader',
  template: `<div [ngClass]="style"></div>`
})


export class PreloaderComponent {
  constructor() {
    this.style = {
      fullscreen: true,
      done: false
    };
  }

  ngOnChanges() {
    this.style.done = this.start;
  }
}
