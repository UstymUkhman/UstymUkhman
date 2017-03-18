import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'contact-me',
  outputs: ['backToMenu'],
  templateUrl: 'components/contact-me/contact-me.component.html'
})


export class ContactMeComponent {
  constructor(contacts, lettering) {
    this.contactIndex     = -1;
    this.currentActive    = -1;

    this.fadeOut          = false;
    this.goToMenu         = false;
    this.startRaining     = false;
    this.showBackButton   = false;
    this.activeBackButton = false;
    this.removeMatrixRain = false;

    this.lettering        = lettering;
    this.backToMenu       = new EventEmitter();
    this.contactsElement  = contacts.nativeElement;

    this.contactsList = [
      'LinkedIn',
      'GitHub',
      'E-mail',
      'CV'
    ];

    this.contactsLinks = [
      'https://www.linkedin.com/in/ustymukhman',
      'https://github.com/UstymUkhman/',
      'mailto:ustym.ukhman@gmail.com',
      'assets/curriculum_vitae.pdf'
    ];
  }

  openContactLink(contact) {
    let target = (contact === 2) ? '_self' : '_blank';
    window.open(this.contactsLinks[contact], target);
  }

  removeContactsSection() {
    this.goToMenu = true;
    document.removeEventListener('keydown', this.contactsNavigation, false);

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 2000);
  }

  returnToMenu() {
    this.backToMenu.emit();
    this.contactsElement.remove();
  }

  checkValidCode(code) {
    return (code === 13 || code === 38 || code === 40)
  }

  setContactsNavigation(event) {
    const code    = event.keyCode,
          contact = this.currentContact;

    if (!this.checkValidCode(code)) {
      return;

    } else if (this.activeBackButton && code === 13) {
      this.removeContactsSection();
      return;

    } else if (this.activeBackButton) {
      this.currentContact   = (code === 38) ? 0 : 3;
      this.activeBackButton = false;

    } else {
      this.activeBackButton = ((this.currentContact === 3 && code === 40) || (!this.currentContact && code === 38));
    }

    if (code === 13)
      this.openContactLink(contact);

    else if (code === 38)
      this.currentContact = (!this.currentContact) ? 3 : this.currentContact - 1;

    else if (code === 40)
      this.currentContact = (this.currentContact === 3) ? 0 : this.currentContact + 1;

    let lastContact    = this.contactSources[contact].children,
        currentContact = this.contactSources[this.currentContact].children;

    lastContact[0].classList.remove('active');
    lastContact[1].classList.remove('active');

    if (this.activeBackButton) {
      return;
    }

    if (lastContact[2]) {
      lastContact[2].classList.remove('active');
    }

    currentContact[0].classList.add('active');
    currentContact[1].classList.add('active');

    if (currentContact[2]) {
      currentContact[2].classList.add('active');
    }
  }

  prepareContactsList() {
    if (++this.contactIndex < this.contactsList.length)
      this.lettering.animate(
        this.contactSources[this.contactIndex].children[1],
        false, this.prepareContactsList.bind(this)
      );

    else {
      this.showBackButton = true;

      setTimeout(() => {
        this.currentActive  = 0;
        this.currentContact = 0;
        this.startRaining   = true;

        this.contactsNavigation = this.setContactsNavigation.bind(this);
        document.addEventListener('keydown', this.contactsNavigation, false);
      }, 2000);
    }
  }

  ngAfterViewInit() {
    this.contactSources = this.contactsElement.getElementsByClassName('contact-source');
    this.prepareContactsList();
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
