import 'zone.js/dist/zone';

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MoreComponent } from './more.component';


@NgModule({
  declarations : [MoreComponent],
  exports      : [MoreComponent],
  imports      : [CommonModule]
})

export class MoreModule { }
