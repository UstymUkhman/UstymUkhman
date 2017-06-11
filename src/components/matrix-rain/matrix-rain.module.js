import 'zone.js/dist/zone';

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

import { RainService         } from '../../services/rain.service';
import { MatrixRainComponent } from './matrix-rain.component';


@NgModule({
  declarations : [MatrixRainComponent],
  exports      : [MatrixRainComponent],
  imports      : [CommonModule],
  providers    : [RainService]
})

export class MatrixRainModule { }
