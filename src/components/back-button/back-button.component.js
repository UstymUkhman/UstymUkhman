import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'back-button',
  outputs: ['matrixCodeRemoved'],
  inputs: ['active', 'backToMenu', 'showBackButton'],
  templateUrl: 'components/back-button/back-button.component.html'
})


export class BackButtonComponent {
  constructor(button, lettering) {
    this.removeMatrixCode  = false;
    this.showBackButton    = false;
    this.initialized       = false;
    this.backToMenu        = false;
    this.fadeOut           = false;
    this.active            = false;

    this.lettering         = lettering;
    this.matrixCodeRemoved = new EventEmitter();
    this.button            = button.nativeElement;
  }

  ngOnChanges() {
    if (this.showBackButton && !this.initialized) {
      let buttonText = this.button.getElementsByClassName('button-box')[0];
      this.lettering.animate(buttonText.children[1], false, null, 100);
      this.initialized = true;
    }

    if (this.backToMenu) {
      setTimeout(() => {
        this.fadeOut = true;
      }, 2000);

      setTimeout(() => {
        this.removeMatrixCode = true;
        this.matrixCodeRemoved.emit();
        this.button.remove();
      }, 5500);
    }
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
