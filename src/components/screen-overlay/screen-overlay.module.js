import 'zone.js/dist/zone';

import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ScreenOverlayComponent } from './screen-overlay.component';


@NgModule({
  declarations : [ScreenOverlayComponent],
  exports      : [ScreenOverlayComponent],
  imports      : [CommonModule]
})

export class ScreenOverlayModule { }
