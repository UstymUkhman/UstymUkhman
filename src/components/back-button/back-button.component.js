import { Component, ElementRef } from '@angular/core';
import { LoadingService        } from '../../services/loading.service';
import { LetteringService      } from '../../services/lettering.service';


@Component({
  selector: 'back-button',
  inputs: ['active', 'backToMenu', 'showBackButton', 'buttonText'],
  templateUrl: 'components/back-button/back-button.component.html'
})


export class BackButtonComponent {
  constructor(button, loading, lettering) {
    this.showBackButton    = false;
    this.initialized       = false;
    this.backToMenu        = false;
    this.fadeOut           = false;
    this.active            = false;

    this.backButton        = true;
    this.loading           = loading;
    this.buttonText        = '< b@cK';
    this.lettering         = lettering;
    this.button            = button.nativeElement;
  }

  ngOnChanges() {
    if (this.showBackButton && !this.initialized) {
      let buttonText = this.button.getElementsByClassName('button-box')[0];
      this.lettering.animate(buttonText.children[1], 100);
      this.initialized = true;
    }

    if (this.backToMenu) {
      setTimeout(() => { this.fadeOut = true; }, 3500);
      setTimeout(this.loading.backToMenu, 8500);
    }
  }

  static get parameters() {
    return [
      [ElementRef],
      [LoadingService],
      [LetteringService]
    ];
  }
}
