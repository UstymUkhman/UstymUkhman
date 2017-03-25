import 'babel-polyfill';
import 'rxjs/add/operator/map';

import { NgModule       } from '@angular/core';
import { HttpModule     } from '@angular/http';
import { BrowserModule  } from '@angular/platform-browser';

import { AppRouting     } from './app.routing';
import { AppComponent   } from './app.component';
import { LoadingService } from '../../services/loading.service';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRouting
  ],

  providers   : [LoadingService],
  declarations: [AppComponent],
  bootstrap   : [AppComponent]
})


export class AppModule { }
