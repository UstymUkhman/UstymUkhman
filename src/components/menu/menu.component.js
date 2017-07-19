import { Component, ElementRef } from '@angular/core';
import { LoadingService        } from '../../services/loading.service';
import { LetteringService      } from '../../services/lettering.service';


@Component({
  selector: 'menu-component',
  inputs: ['showOverlay', 'activeItem', 'showMenu'],
  templateUrl: 'components/menu/menu.component.html'
})


export class MenuComponent {
  constructor(menu, loading, lettering) {
    this.hiddenItems   = true;
    this.settedSection = null;

    this.startRaining  = false;
    this.stopRaining   = false;
    this.fadeOutArea   = false;

    this.pages = [
      'Ab0uT_m3'   ,
      'My_W0rk5'   ,
      'C0nT@cT_m3' ,
      'M0r3'
    ];

    this.itemIndex   = -1;
    this.loading     = loading;
    this.lettering   = lettering;

    this.menu        = menu.nativeElement;
    this.itemBoxes   = this.menu.getElementsByClassName('button-box');
    this.menuItems   = this.menu.getElementsByClassName('button-border');
  }

  setMenuSection(section) {
    this.settedSection = section;
    document.removeEventListener('keydown', this.menuNavigation, false);

    if (isMobile) {
      for (let i = 0; i < this.itemBoxes.length; i++) {
        this.itemBoxes[i].removeEventListener('click', this.setClickHandler.bind(this, i), false);
      }
    }

    setTimeout(() => { this.fadeOutArea = true; }, 3500);

    setTimeout(() => {
      this.stopRaining = true;
      this.loading.setActivePage(section);
    }, 8500);
  }

  setMenuNavigation(event) {
    const code = event.keyCode,
          item = this.currentItem;

    if (code === 13)
      this.setMenuSection(item);

    else if (code === 38)
      this.currentItem = (!this.currentItem) ? 3 : this.currentItem - 1;

    else if (code === 40)
      this.currentItem = (this.currentItem === 3) ? 0 : this.currentItem + 1;
  }

  setClickHandler(index) {
    this.currentItem = index;
    this.setMenuNavigation({keyCode: 13});
  }

  showMenuItems() {
    if (++this.itemIndex < this.pages.length)
      this.lettering.animate(
        this.itemBoxes[this.itemIndex].children[1],
        100, this.showMenuItems.bind(this)
      );

    else {
      this.settedSection  = null;
      this.hiddenItems    = false;
      this.currentItem    = this.activeItem || 0;
      this.menuNavigation = this.setMenuNavigation.bind(this);

      setTimeout(() => { this.startRaining = true; }, 1500);
      document.addEventListener('keydown', this.menuNavigation, false);

      if (isMobile) {
        for (let i = 0; i < this.itemBoxes.length; i++) {
          this.itemBoxes[i].addEventListener('click', this.setClickHandler.bind(this, i), false);
        }
      }
    }
  }

  ngOnChanges() {
    if (this.showMenu) {
      this.showMenuItems();
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
