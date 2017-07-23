import { Component, EventEmitter, ElementRef } from '@angular/core';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'about-me',
  templateUrl: 'components/about-me/about-me.component.html'
})


export class AboutMeComponent {
  constructor(aboutMe, lettering) {
    this.aboutElement     = aboutMe.nativeElement;
    this.lettering        = lettering;

    this.activeBackButton = false;
    this.showBackButton   = false;
    this.goToMenu         = false;
    this.fadeOut          = false;

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
    setTimeout(() => { this.fadeOut = true; }, 3500);
    document.removeEventListener('keydown', this.onKeyDown, false);

    if (isMobile) {
      document.removeEventListener('click', this.onKeyDown, false);
    }
  }

  setKeyDownHandler(event) {
    if (this.activeBackButton && event.keyCode === 13) {
      this.removeAboutMeSection();

    } else if (!this.showBackButton) {
      this.lettering.skipLettering();
    }
  }

  showMessage() {
    this.lettering.animate(this.aboutMessage.children[1], 50, () => {
      this.showBackButton = true;
      setTimeout(() => { this.activeBackButton = true; }, 1000);
    });
  }

  ngAfterViewInit() {
    this.onKeyDown = this.setKeyDownHandler.bind(this);
    document.addEventListener('keydown', this.onKeyDown, false);

    if (isMobile) {
      document.addEventListener('click', this.onKeyDown, false);
    }

    this.aboutMessage = this.aboutElement.firstChild;
    this.showMessage();
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
