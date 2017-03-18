import 'zone.js/dist/zone';

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { MatrixCodeComponent } from './matrix-code.component';


@NgModule({
  declarations : [MatrixCodeComponent],
  exports      : [MatrixCodeComponent],
  imports      : [CommonModule]
})

export class MatrixCodeModule { }
