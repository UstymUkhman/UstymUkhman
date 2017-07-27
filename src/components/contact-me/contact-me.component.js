import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'contact-me',
  templateUrl: 'components/contact-me/contact-me.component.html'
})


export class ContactMeComponent {
  constructor(contacts, lettering) {
    this.fadeOut          = false;
    this.goToMenu         = false;
    this.startRaining     = false;
    this.skipLettering    = false;
    this.showBackButton   = false;
    this.activeBackButton = false;
    this.removeMatrixRain = false;

    this.contactIndex     = -1;
    this.lettering        = lettering;
    this.contactsElement  = contacts.nativeElement;

    this.contactsList = [
      'LinkedIn',
      'GitHub',
      'CodePen',
      'E-mail'
      // 'CV'
    ];

    this.contactsLinks = [
      'https://www.linkedin.com/in/ustymukhman',
      'https://github.com/UstymUkhman/',
      'https://codepen.io/UstymUkhman/',
      'mailto:ustym.ukhman@gmail.com'
      // 'assets/curriculum_vitae.pdf'
    ];
  }

  openContactLink(contact) {
    let target = (contact === 3) ? '_self' : '_blank';
    window.open(this.contactsLinks[contact], target);
  }

  removeContactsSection() {
    this.goToMenu = true;

    this.removeClickHandler();
    document.removeEventListener('keydown', this.contactsNavigation, false);

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 3500);
  }

  checkValidCode(code) {
    return (code === 13 || code === 38 || code === 40)
  }

  setContactsNavigation(event) {
    if (!this.startRaining) {
      this.lettering.skipLettering();
      this.skipLettering = true;
      return;
    }

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

    if (this.activeBackButton) {
      this.currentContact = -1;
    }
  }

  prepareContactsList(endAnimation = false) {
    if (!endAnimation) {
      const delay = this.skipLettering ? 0 : 1000;

      setTimeout(() => {
        const nextIndex = ++this.contactIndex;

        if (!this.contactSources[nextIndex]) {
          this.prepareContactsList(true);
          return;
        }

        this.lettering.animate(
          this.contactSources[nextIndex].children[1],
          50, this.prepareContactsList.bind(this), 0
        );

        if (this.skipLettering) {
          this.lettering.skipLettering();
          this.prepareContactsList();
        }
      }, delay);

    } else if (!this.showBackButton) {
      const buttonDelay = this.skipLettering ? 500 : 0;

      setTimeout(() => {
        this.showBackButton = true;
      }, buttonDelay);

      setTimeout(() => {
        this.startRaining = true;
        this.currentContact = isMobile ? null : 0;
      }, buttonDelay + 1000);
    }
  }

  setClickHandler(index) {
    if (typeof index !== 'number') {
      this.setContactsNavigation({ keyCode: 0 });
      return;
    }

    this.currentContact = index;
    setTimeout(() => { this.openContactLink(index); }, 400);
  }

  setClickHandler() {
    if (isMobile) {
      for (let i = 0; i < this.contactSources.length; i++) {
        this.contactSources[i].addEventListener('click', this.setClickHandler.bind(this, i), false);
      }

      document.addEventListener('click', this.setClickHandler.bind(this), false);
    }
  }

  removeClickHandler() {
    if (isMobile && this.contactSources.length) {
      for (let i = 0; i < this.contactSources.length; i++) {
        this.contactSources[i].removeEventListener('click', this.setClickHandler.bind(this, i), false);
      }

      document.removeEventListener('click', this.setClickHandler.bind(this), false);
    }
  }

  ngAfterViewInit() {
    this.contactsNavigation = this.setContactsNavigation.bind(this);
    document.addEventListener('keydown', this.contactsNavigation, false);
    this.contactSources = this.contactsElement.getElementsByClassName('contact-source');

    this.setClickHandler();
    this.prepareContactsList();
  }

  ngOnDestroy() {
    this.removeClickHandler();
    document.removeEventListener('keydown', this.contactsNavigation, false);
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
