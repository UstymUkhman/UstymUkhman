import 'babel-polyfill';
import 'rxjs/add/operator/map';

import { NgModule         } from '@angular/core';
import { HttpModule       } from '@angular/http';
import { BrowserModule    } from '@angular/platform-browser';

import { AppRouting       } from './app.routing';
import { AppComponent     } from './app.component';
import { SoundsService    } from '../../services/sounds.service';
import { LoadingService   } from '../../services/loading.service';

import { MoreModule       } from '../more/more.module';
import { AboutMeModule    } from '../about-me/about-me.module';
import { MyWorksModule    } from '../my-works/my-works.module';
import { ContactMeModule  } from '../contact-me/contact-me.module';
import { RabbitHoleModule } from '../rabbit-hole/rabbit-hole.module';


@NgModule({
  imports: [
    AppRouting       ,
    MoreModule       ,
    HttpModule       ,
    AboutMeModule    ,
    MyWorksModule    ,
    BrowserModule    ,
    ContactMeModule  ,
    RabbitHoleModule ,
  ],

  providers   : [SoundsService, LoadingService],
  declarations: [AppComponent],
  bootstrap   : [AppComponent]
})


export class AppModule { }
