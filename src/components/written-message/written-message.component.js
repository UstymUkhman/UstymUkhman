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

    if (this.start && this.messageList[++this.currentIndex])
      this.showTimeout = setTimeout(this.showMessage.bind(this), delay);

    else if (this.currentIndex === this.messageList.length)
      this.currentIndex--;
  }

  removeMessage() {
    this.dissolve = true;
    document.removeEventListener('keydown', this.onKeyDown, false);

    if (isMobile) {
      document.removeEventListener('click', this.onKeyDown, false);
    }

    setTimeout(() => { this.consoleReady.emit(true); }, 2000);
    setTimeout(() => { this.messageElement.remove(); }, 4500);
  }

  showMessage() {
    this.lettering.animate(this.message, 150, this.prepareMessage.bind(this), 1500);
  }

  setKeyDownHandler() {
    this.lettering.skipLettering();
    const lastMessage = this.messageList.length - 1;

    if (this.currentIndex === lastMessage) {
      const delay = isMobile ? 500 : 100;
      setTimeout(() => { this.removeMessage(); }, delay);
    }
  }

  ngOnChanges() {
    if (this.start) {
      this.message = this.messageElement.firstChild.children[0];
      this.prepareMessage();

      this.onKeyDown = this.setKeyDownHandler.bind(this);
      document.addEventListener('keydown', this.onKeyDown, false);

      if (isMobile) {
        document.addEventListener('click', this.onKeyDown, false);
      }
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.onKeyDown, false);

    if (isMobile) {
      document.removeEventListener('click', this.onKeyDown, false);
    }
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
