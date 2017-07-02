import 'zone.js/dist/zone';

import { NgModule             } from '@angular/core';
import { CommonModule         } from '@angular/common';

import { MenuComponent        } from './menu.component';
import { LoadingService       } from '../../services/loading.service';
import { LetteringService     } from '../../services/lettering.service';

import { MatrixCodeModule     } from '../matrix-code/matrix-code.module';
import { MatrixRainModule     } from '../matrix-rain/matrix-rain.module';
import { ScreenOverlayModule  } from '../screen-overlay/screen-overlay.module';


@NgModule({
  imports : [
    CommonModule,
    MatrixCodeModule,
    MatrixRainModule,
    ScreenOverlayModule
  ],

  exports      : [MenuComponent],
  declarations : [MenuComponent],

  providers : [
    LoadingService,
    LetteringService
  ]
})


export class MenuModule { }
