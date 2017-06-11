import 'zone.js/dist/zone';

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

import { MatrixCodeComponent } from './matrix-code.component';
import { RainService         } from '../../services/rain.service';


@NgModule({
  declarations : [MatrixCodeComponent],
  exports      : [MatrixCodeComponent],
  imports      : [CommonModule],
  providers    : [RainService]
})

export class MatrixCodeModule { }
