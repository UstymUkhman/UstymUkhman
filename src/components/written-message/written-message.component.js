import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  inputs      : ['start'],
  outputs     : ['consoleReady'],
  selector    : 'written-message',
  templateUrl : 'components/written-message/written-message.component.html'
})


export class WrittenMessageComponent {
  constructor(writtenMessage, lettering) {
    this.currentIndex   = -1;
    this.lettering      = lettering;
    this.consoleReady   = new EventEmitter();
    this.messageElement = writtenMessage.nativeElement;

    this.messageList = [
      'Hello my friend.',
      'Welcome...'
    ];
  }

  prepareMessage() {
    if (this.start && this.messageList[++this.currentIndex]) {
      setTimeout(this.showMessage.bind(this), 1500);

    } else if (this.currentIndex === this.messageList.length) {
      this.currentIndex--;
      this.message.classList.add('scale-message');

      setTimeout(() => {
        this.consoleReady.emit(true);
      }, 1000);

      setTimeout(() => {
        this.message.classList.add('dissolve-text');

        setTimeout(() => {
          this.messageElement.remove();
        }, 2500);
      }, 2500);
    }
  }

  showMessage() {
    this.lettering.animate(this.message, true, this.prepareMessage.bind(this));
  }

  ngOnChanges() {
    this.message = this.messageElement.firstChild.children[0];
    this.prepareMessage();
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
