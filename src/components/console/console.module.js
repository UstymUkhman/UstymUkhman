import 'zone.js/dist/zone';

import { NgModule             } from '@angular/core';
import { CommonModule         } from '@angular/common';
import { ConsoleComponent     } from './console.component';
import { LoadingService       } from '../../services/loading.service';

import { MenuModule           } from '../menu/menu.module';
import { PreloaderModule      } from '../preloader/preloader.module';
import { MatrixCodeModule     } from '../matrix-code/matrix-code.module';
import { ScreenOverlayModule  } from '../screen-overlay/screen-overlay.module';
import { WrittenMessageModule } from '../written-message/written-message.module';


@NgModule({
  imports: [
    MenuModule,
    CommonModule,
    PreloaderModule,
    MatrixCodeModule,
    ScreenOverlayModule,
    WrittenMessageModule
  ],

  declarations: [ConsoleComponent],
  exports     : [ConsoleComponent],

  providers: [
    LoadingService,
    PreloaderModule
  ]
})


export class ConsoleModule { }
