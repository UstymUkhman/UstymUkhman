import 'zone.js/dist/zone';

import { NgModule         } from '@angular/core';
import { CommonModule     } from '@angular/common';
import { AboutMeComponent } from './about-me.component';

import { LetteringService } from '../../services/lettering.service';
import { BackButtonModule } from '../back-button/back-button.module';


@NgModule({
  imports: [
    CommonModule,
    BackButtonModule
  ],

  declarations : [AboutMeComponent],
  providers    : [LetteringService],
  exports      : [AboutMeComponent]
})

export class AboutMeModule { }
