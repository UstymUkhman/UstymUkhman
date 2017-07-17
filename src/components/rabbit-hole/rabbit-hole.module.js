import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';

import { RabbitHoleComponent } from './rabbit-hole.component';
import { ScreenOverlayModule } from '../screen-overlay/screen-overlay.module';

import { SoundsService       } from '../../services/sounds.service';
import { LoadingService      } from '../../services/loading.service';
import { ControlsService     } from '../../services/controls.service';
import { LetteringService    } from '../../services/lettering.service';


@NgModule({
  declarations : [RabbitHoleComponent],
  exports      : [RabbitHoleComponent],
  imports      : [CommonModule, ScreenOverlayModule],
  providers    : [
    SoundsService,
    LoadingService,
    ControlsService,
    LetteringService
  ]
})


export class RabbitHoleModule { }
