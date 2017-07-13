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
    this.dissolve       = false;
    this.lettering      = lettering;
    this.consoleReady   = new EventEmitter();
    this.messageElement = writtenMessage.nativeElement;

    this.messageList = [
      'Hello my friend.',
      'I\'m glad to see you here.',
      'Follow your instincts...'
    ];
  }

  prepareMessage() {
    const delay = this.currentIndex < 0 ? 3000 : 1500;

    if (this.start && this.messageList[++this.currentIndex]) {
      this.showTimeout = setTimeout(this.showMessage.bind(this), delay);

    } else if (this.currentIndex === this.messageList.length) {
      this.dissolve = true;
      this.currentIndex--;

      setTimeout(() => {
        this.consoleReady.emit(true);
      }, 2000);

      setTimeout(() => {
        this.messageElement.remove();
      }, 4500);
    }
  }

  skipMessages() {
    clearTimeout(this.showTimeout);
    this.consoleReady.emit(true);

    setTimeout(() => {
      this.messageElement.remove();
    }, 1000);
  }

  showMessage() {
    this.lettering.animate(this.message, 150, this.prepareMessage.bind(this), 2000);
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.skipMessages.bind(this), false);
  }

  ngOnChanges() {
    this.message = this.messageElement.firstChild.children[0];
    this.prepareMessage();
  }

  ngOnDestroy() {
    this.audio.endSpeach();
    document.removeEventListener('keydown', this.skipMessages.bind(this), false);
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
