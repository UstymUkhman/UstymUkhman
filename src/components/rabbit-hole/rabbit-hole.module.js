import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';

import { RabbitHoleComponent } from './rabbit-hole.component';
import { ControlsService     } from '../../services/controls.service';
import { LetteringService    } from '../../services/lettering.service';


@NgModule({
  imports      : [CommonModule],
  declarations : [RabbitHoleComponent],
  exports      : [RabbitHoleComponent],
  providers    : [ControlsService, LetteringService]
})


export class RabbitHoleModule { }
