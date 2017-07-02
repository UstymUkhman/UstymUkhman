import 'zone.js/dist/zone';

import { NgModule             } from '@angular/core';
import { CommonModule         } from '@angular/common';

import { ContactMeComponent   } from './contact-me.component';
import { LetteringService     } from '../../services/lettering.service';

import { MatrixCodeModule     } from '../matrix-code/matrix-code.module';
import { MatrixRainModule     } from '../matrix-rain/matrix-rain.module';
import { BackButtonModule     } from '../back-button/back-button.module';
import { ScreenOverlayModule  } from '../screen-overlay/screen-overlay.module';


@NgModule({
  imports: [
    CommonModule,
    MatrixCodeModule,
    MatrixRainModule,
    BackButtonModule,
    ScreenOverlayModule
  ],

  declarations : [ContactMeComponent],
  exports      : [ContactMeComponent],
  providers    : [LetteringService]
})

export class ContactMeModule { }
