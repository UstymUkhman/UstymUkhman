import 'zone.js/dist/zone';

import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { PreloaderComponent } from './preloader.component';


@NgModule({
  declarations : [PreloaderComponent],
  exports      : [PreloaderComponent],
  imports      : [CommonModule]
})

export class PreloaderModule { }
