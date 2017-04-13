import 'zone.js/dist/zone';

import { NgModule            } from '@angular/core';
import { CommonModule        } from '@angular/common';
import { RabbitHoleComponent } from './rabbit-hole.component';


@NgModule({
  imports      : [CommonModule],
  declarations : [RabbitHoleComponent],
  exports      : [RabbitHoleComponent]
})


export class RabbitHoleModule { }
