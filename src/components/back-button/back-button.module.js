import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';
import { BackButtonComponent } from './back-button.component';

import { LoadingService      } from '../../services/loading.service';
import { LetteringService    } from '../../services/lettering.service';
import { MatrixCodeModule    } from '../matrix-code/matrix-code.module';


@NgModule({
  imports : [
    CommonModule,
    MatrixCodeModule
  ],

  providers : [
    LoadingService,
    LetteringService
  ],

  exports      : [BackButtonComponent],
  declarations : [BackButtonComponent]
})

export class BackButtonModule { }
