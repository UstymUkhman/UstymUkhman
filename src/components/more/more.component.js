import {Component} from '@angular/core';


@Component({
  selector: 'more',
  templateUrl: 'components/more/more.component.html'
})


export class MoreComponent {
  constructor(more) {
    console.log('More constructor.');
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
