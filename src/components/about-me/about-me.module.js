import 'zone.js/dist/zone';

import { NgModule             } from '@angular/core';
import { CommonModule         } from '@angular/common';
import { AboutMeComponent     } from './about-me.component';

import { LetteringService     } from '../../services/lettering.service';
import { BackButtonModule     } from '../back-button/back-button.module';
import { ScreenOverlayModule  } from '../screen-overlay/screen-overlay.module';


@NgModule({
  imports: [
    CommonModule,
    BackButtonModule,
    ScreenOverlayModule
  ],

  declarations : [AboutMeComponent],
  providers    : [LetteringService],
  exports      : [AboutMeComponent]
})

export class AboutMeModule { }
