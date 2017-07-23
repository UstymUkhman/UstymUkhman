import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LoadingService                      } from '../../services/loading.service';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'back-button',
  outputs: ['buttonClicked'],
  inputs: ['active', 'backToMenu', 'showBackButton'],
  templateUrl: 'components/back-button/back-button.component.html'
})


export class BackButtonComponent {
  constructor(button, loading, lettering) {
    this.showBackButton = false;
    this.initialized    = false;
    this.backToMenu     = false;
    this.fadeOut        = false;
    this.active         = false;

    this.loading        = loading;
    this.lettering      = lettering;
    this.buttonClicked  = new EventEmitter();
    this.button         = button.nativeElement;
  }

  setClickHandler() {
    this.buttonClicked.emit();
  }

  ngOnChanges() {
    if (this.showBackButton && !this.initialized) {
      const buttonText = this.button.getElementsByClassName('button-box')[0];

      this.lettering.animate(buttonText.children[1], 100);
      this.initialized = true;

      if (isMobile) {
        this.buttonBox = this.button.getElementsByClassName('back-button-container')[0];

        this.onClick = this.setClickHandler.bind(this);
        this.buttonBox.addEventListener('click', this.onClick, false);
      }
    }

    if (this.backToMenu) {
      setTimeout(() => { this.fadeOut = true; }, 3500);
      setTimeout(() => { this.loading.backToMenu(); }, 8500);
    }
  }

  ngOnDestroy() {
    if (isMobile) {
      this.buttonBox.removeEventListener('click', this.onClick, false);
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
