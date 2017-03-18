import 'zone.js/dist/zone';

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { MatrixRainComponent } from './matrix-rain.component';


@NgModule({
  declarations : [MatrixRainComponent],
  exports      : [MatrixRainComponent],
  imports      : [CommonModule]
})

export class MatrixRainModule { }
