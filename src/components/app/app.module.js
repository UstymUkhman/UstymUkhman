import 'babel-polyfill';
import 'rxjs/add/operator/map';

import { NgModule      } from '@angular/core';
import { HttpModule    } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting    } from './app.routing';
import { AppComponent  } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRouting
  ],

  declarations: [AppComponent],
  bootstrap   : [AppComponent]
})


export class AppModule { }
