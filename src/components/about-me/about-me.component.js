import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'about-me',
  outputs: ['backToMenu'],
  templateUrl: 'components/about-me/about-me.component.html'
})


export class AboutMeComponent {
  constructor(aboutMe, lettering) {
    this.activeBackButton = false;
    this.showBackButton   = false;
    this.goToMenu         = false;
    this.fadeOut          = false;

    this.aboutElement     = aboutMe.nativeElement;
    this.backToMenu       = new EventEmitter();
    this.lettering        = lettering;

    this.years = (() => {
      let today  = new Date(),
          arrive = (today.getMonth() > 7) ? 2005 : 2006;

      return today.getFullYear() - arrive;
    })();

    this.aboutDescription = `
      Hi, my name is Ustym and I'm a front-end web developer at MONOGRID.#
      I was born and raised in Zbarazh (Ucraine), however I live in Florence (Italy) for ${this.years} years so far.##

      Things I love:#
      %- Learning and using innovative web technologies#
      %- JavaScript in (almost) all its forms#
      %- CSS3 (and SCSS preprocessor)#
      %- Music, Films & Coffee##

      Things I hate:#
      %- Social Networks#
      %- Dirty code#
      %- Mondays#
    `;
  }

  removeAboutMeSection() {
    this.goToMenu = true;
    document.removeEventListener('keydown', this.backButtonHandler, false);

    setTimeout(() => {
      this.fadeOut = true;
    }, 2000);
  }

  setBackButtonHandler(event) {
    if (event.keyCode === 13)
      this.removeAboutMeSection();
  }

  showMessage() {
    this.lettering.animate(this.aboutMessage.children[0], false, () => {
      this.showBackButton = true;

      setTimeout(() => {
        this.activeBackButton  = true;
        this.backButtonHandler = this.setBackButtonHandler.bind(this);
        document.addEventListener('keydown', this.backButtonHandler, false);
      }, 2000);
    });
  }

  returnToMenu() {
    this.backToMenu.emit();
    this.aboutElement.remove();
  }

  ngAfterViewInit() {
    this.aboutMessage = this.aboutElement.children[0];
    this.showMessage();
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
