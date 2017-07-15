import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';

import { RabbitHoleComponent } from './rabbit-hole.component';
import { ControlsService     } from '../../services/controls.service';
import { LetteringService    } from '../../services/lettering.service';
import { ScreenOverlayModule } from '../screen-overlay/screen-overlay.module';


@NgModule({
  declarations : [RabbitHoleComponent],
  exports      : [RabbitHoleComponent],
  imports      : [CommonModule, ScreenOverlayModule],
  providers    : [ControlsService, LetteringService]
})


export class RabbitHoleModule { }
