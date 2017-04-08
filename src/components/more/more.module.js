import 'zone.js/dist/zone';

import { NgModule         } from '@angular/core';
import { CommonModule     } from '@angular/common';

import { MoreComponent    } from './more.component';
import { MatrixCodeModule } from '../matrix-code/matrix-code.module';
import { MatrixRainModule } from '../matrix-rain/matrix-rain.module';

import { SoundsService    } from '../../services/sounds.service';


@NgModule({
  imports: [
    CommonModule,
    MatrixCodeModule,
    MatrixRainModule
  ],

  providers    : [SoundsService],
  declarations : [MoreComponent],
  exports      : [MoreComponent]
})

export class MoreModule { }
