import { NgModule             } from '@angular/core';
import { RouterModule         } from '@angular/router';

import { ConsoleModule        } from '../console/console.module';
import { ConsoleComponent     } from '../console/console.component';
import { LoadingService       } from '../../services/loading.service';

import { MoreComponent        } from '../more/more.component';
import { AboutMeComponent     } from '../about-me/about-me.component';
import { MyWorksComponent     } from '../my-works/my-works.component';
import { ContactMeComponent   } from '../contact-me/contact-me.component';
import { RabbitHoleComponent  } from '../rabbit-hole/rabbit-hole.component';
import { ExperimentsComponent } from '../experiments/experiments.component';


const routes = [
  { path: '',            component: ConsoleComponent, canActivate: [LoadingService] },
  { path: 'about',       component: AboutMeComponent                                },
  { path: 'works',       component: MyWorksComponent                                },
  { path: 'contact',     component: ContactMeComponent                              },
  { path: 'more',        component: MoreComponent                                   },
  { path: 'experiments', component: ExperimentsComponent                            },
  { path: 'rabbit-hole', component: RabbitHoleComponent                             },
  { path: '**',          redirectTo: '/'                                            }
];


@NgModule({
  imports: [
    ConsoleModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],

  providers: [LoadingService],
  exports  : [RouterModule]
})


export class AppRouting { }
