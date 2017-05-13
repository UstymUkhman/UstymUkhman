import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';

import { RabbitHoleComponent } from './rabbit-hole.component';
import { ControlsService     } from '../../services/controls.service';


@NgModule({
  imports      : [CommonModule],
  providers    : [ControlsService],
  declarations : [RabbitHoleComponent],
  exports      : [RabbitHoleComponent]
})


export class RabbitHoleModule { }
