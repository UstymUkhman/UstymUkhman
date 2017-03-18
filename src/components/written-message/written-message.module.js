import 'zone.js/dist/zone';

import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';

import { WrittenMessageComponent } from './written-message.component';
import { LetteringService }        from '../../services/lettering.service';


@NgModule({
  declarations : [WrittenMessageComponent],
  exports      : [WrittenMessageComponent],
  providers    : [LetteringService],
  imports      : [CommonModule]
})

export class WrittenMessageModule { }
