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
      this.currentIndex--;
      this.removeMessage();
    }
  }

  removeMessage() {
    this.dissolve = true;

    setTimeout(() => { this.consoleReady.emit(true); }, 2000);
    setTimeout(() => { this.messageElement.remove(); }, 4500);
  }

  skipMessages() {
    clearTimeout(this.showTimeout);
    cancelAnimationFrame(this.lettering.getAnimationFrameID());

    this.removeMessage();
  }

  showMessage() {
    this.lettering.animate(this.message, 150, this.prepareMessage.bind(this), 2000);
  }

  ngAfterViewInit() {
    this.skipEvent = this.skipMessages.bind(this);
    document.addEventListener('keydown', this.skipEvent, false);
  }

  ngOnChanges() {
    this.message = this.messageElement.firstChild.children[0];
    this.prepareMessage();
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.skipEvent, false);
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
