import { Component, ElementRef } from '@angular/core';
import { LoadingService        } from '../../services/loading.service';
import { LetteringService      } from '../../services/lettering.service';


@Component({
  selector: 'menu',
  inputs: ['activeItem', 'showMenu'],
  templateUrl: 'components/menu/menu.component.html'
})


export class MenuComponent {
  constructor(menu, loading, lettering) {
    this.startRaining  = false;
    this.stopRaining   = false;
    this.fadeOutArea   = false;
    this.settedSection = false;

    this.pages = [
      'Ab0uT_m3'   ,
      'My_W0rk5'   ,
      'C0nT@cT_m3' ,
      'M0r3'
    ];

    this.itemIndex = -1;
    this.loading   = loading;
    this.lettering = lettering;

    this.menu      = menu.nativeElement;
    this.itemBoxes = this.menu.getElementsByClassName('item-box');
    this.menuItems = this.menu.getElementsByClassName('menu-item');
  }

  setMenuSection(section) {
    this.settedSection = true;

    setTimeout(() => {
      this.fadeOutArea = true;

      setTimeout(() => {
        document.removeEventListener('keydown', this.menuNavigation, false);
        this.itemBoxes[section].classList.remove('active-item');

        this.stopRaining = true;
        this.loading.setActivePage(section);
      }, 3000);
    }, 2500);
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

    this.itemBoxes[item].classList.remove('active-item');
    this.itemBoxes[this.currentItem].classList.add('active-item');
  }

  showMenuItems() {
    if (++this.itemIndex < this.pages.length)
      this.lettering.animate(
        this.itemBoxes[this.itemIndex].children[1],
        false, this.showMenuItems.bind(this)
      );

    else {
      for (let i = 0; i < this.menuItems.length; i++)
        this.menuItems[i].classList.remove('hidden-item');

      this.startRaining   = true;
      this.hideMatrixCode = false;
      this.currentItem    = this.currentItem || 0;
      this.menuNavigation = this.setMenuNavigation.bind(this);

      this.itemBoxes[this.currentItem].classList.add('active-item');
      document.addEventListener('keydown', this.menuNavigation, false);
    }
  }

  ngOnChanges() {
    if (this.showMenu) {
      this.currentItem = this.activeItem;
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
