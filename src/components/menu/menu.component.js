import { Component, ElementRef } from '@angular/core';
import { LetteringService      } from '../../services/lettering.service';


@Component({
  selector: 'menu',
  inputs: ['showMenu'],
  templateUrl: 'components/menu/menu.component.html'
})


export class MenuComponent {
  constructor(menu, lettering) {
    this.startRaining  = false;
    this.settedSection = false;

    this.items = [
      'Ab0uT_m3',
      'My_W0rk5',
      'C0nT@cT_m3',
      'M0r3'
    ];

    this.itemIndex     = -1;
    this.lettering     = lettering;
    this.activeSection = Array.from(this.items, () => false);

    this.menuAreas = menu.nativeElement.getElementsByClassName('menu-area');
    this.menuItems = menu.nativeElement.getElementsByClassName('menu-item');
    this.itemBoxes = menu.nativeElement.getElementsByClassName('item-box');
    this.menu      = menu.nativeElement;
  }

  setMenuSection(section) {
    this.settedSection   = true;
    this.resetMatrixCode = false;

    setTimeout(() => {
      this.menuAreas[0].classList.add('fade-out');
      this.menuAreas[1].classList.add('fade-out');

      setTimeout(() => {
        document.removeEventListener('keydown', this.menuNavigation, false);
        this.itemBorders[section].classList.remove('active-item');
        this.activeSection[section] = true;
        this.stopRaining = true;
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

    this.itemBorders[item].classList.remove('active-item');
    this.itemBorders[this.currentItem].classList.add('active-item');
  }

  showMenuItems() {
    if (++this.itemIndex < this.items.length)
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
      this.itemBorders    = Array.from(this.menuItems, (item) => item.children[0]);
      this.menuNavigation = this.setMenuNavigation.bind(this);

      document.addEventListener('keydown', this.menuNavigation, false);
      this.itemBorders[this.currentItem].classList.add('active-item');
    }
  }

  resetMenu() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].classList.add('hidden-item');
    }

    for (let i = 0; i < this.itemBoxes.length; i++) {
      let menuItem = this.itemBoxes[i].children[1].children;

      for (let j = 0; j < menuItem.length; j++) {
        menuItem[j].style.visibility = 'hidden';
      }
    }

    this.menuAreas[0].classList.remove('fade-out');
    this.menuAreas[1].classList.remove('fade-out');

    this.itemIndex       = -1;
    this.hideMatrixCode  = true;
    this.resetMatrixCode = true;

    this.startRaining    = false;
    this.settedSection   = false;
    this.activeSection   = Array.from(this.items, () => false);

    this.showMenuItems();
  }

  ngOnChanges() {
    if (this.showMenu) {
      this.showMenuItems();
    }
  }

  static get parameters() {
    return [[ElementRef], [LetteringService]];
  }
}
