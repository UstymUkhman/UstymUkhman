import 'zone.js/dist/zone';

import { NgModule         } from '@angular/core';
import { CommonModule     } from '@angular/common';

import { MoreComponent    } from './more.component';
import { MatrixCodeModule } from '../matrix-code/matrix-code.module';
import { MatrixRainModule } from '../matrix-rain/matrix-rain.module';


@NgModule({
  imports: [
    CommonModule,
    MatrixCodeModule,
    MatrixRainModule
  ],

  declarations : [MoreComponent],
  exports      : [MoreComponent]
})

export class MoreModule { }
