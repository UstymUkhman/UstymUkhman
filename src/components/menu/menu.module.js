import 'zone.js/dist/zone';

import { NgModule         } from '@angular/core';
import { CommonModule     } from '@angular/common';

import { MenuComponent    } from './menu.component';
import { LetteringService } from '../../services/lettering.service';

import { MatrixCodeModule } from '../matrix-code/matrix-code.module';
import { MatrixRainModule } from '../matrix-rain/matrix-rain.module';

import { AboutMeModule    } from '../about-me/about-me.module';
import { MyWorksModule    } from '../my-works/my-works.module';
import { ContactMeModule  } from '../contact-me/contact-me.module';


@NgModule({
  imports : [
    CommonModule,
    AboutMeModule,
    MyWorksModule,
    ContactMeModule,
    MatrixCodeModule,
    MatrixRainModule
  ],

  providers    : [LetteringService],
  exports      : [MenuComponent],
  declarations : [MenuComponent]
})

export class MenuModule { }
