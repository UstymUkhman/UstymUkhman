import 'zone.js/dist/zone';

import { NgModule         } from '@angular/core';
import { CommonModule     } from '@angular/common';

import { MyWorksComponent } from './my-works.component';
import { LetteringService } from '../../services/lettering.service';

import { MatrixCodeModule } from '../matrix-code/matrix-code.module';
import { MatrixRainModule } from '../matrix-rain/matrix-rain.module';
import { BackButtonModule } from '../back-button/back-button.module';


@NgModule({
  imports : [
    CommonModule,
    MatrixCodeModule,
    MatrixRainModule,
    BackButtonModule
  ],

  declarations : [MyWorksComponent],
  exports      : [MyWorksComponent],
  providers    : [LetteringService]
})

export class MyWorksModule { }
