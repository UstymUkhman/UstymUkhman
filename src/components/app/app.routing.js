import { NgModule           } from '@angular/core';
import { RouterModule       } from '@angular/router';

import { ConsoleModule      } from '../console/console.module';
import { ConsoleComponent   } from '../console/console.component';

import { MoreComponent      } from '../more/more.component';
import { AboutMeComponent   } from '../about-me/about-me.component';
import { MyWorksComponent   } from '../my-works/my-works.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';


const routes = [
  { path: '',        component: ConsoleComponent   },
  { path: 'about',   component: AboutMeComponent   },
  { path: 'works',   component: MyWorksComponent   },
  { path: 'contact', component: ContactMeComponent },
  { path: 'more',    component: MoreComponent      },
  { path: '**',      redirectTo: ''                }
];


@NgModule({
  imports: [
    ConsoleModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})


export class AppRouting { }
