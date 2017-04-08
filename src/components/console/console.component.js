import { Component      } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector    : 'console',
  templateUrl : 'components/console/console.component.html'
})


export class ConsoleComponent {
  constructor(loading) {
    this.menuReady      = false;
    this.codeIsReady    = false;
    this.overlayReady   = false;
    this.consoleIsReady = false;

    this.showConsole    = false;
    this.hiddenLoading  = false;
    this.visibleOverlay = false;
    this.lastActiveItem = loading.getLastItem();
  }

  consoleGotReady(ready) {
    this.consoleIsReady = ready;
    this.runCodeOverlayWhenReady();
  }

  codeGotReady(ready) {
    this.codeIsReady = ready;
    this.runCodeOverlayWhenReady();
  }

  runCodeOverlayWhenReady() {
    if (this.codeIsReady && this.consoleIsReady) {
      this.overlayReady = true;
    }
  }

  codeGotRuned(ready) {
    this.menuReady = ready;
  }

  ngAfterViewInit() {
    this.showConsole    = true;
    this.visibleOverlay = true;
    this.hiddenLoading  = this.lastActiveItem === null;

    if (this.lastActiveItem !== null)
      this.codeGotRuned(true);
  }

  static get parameters() {
    return [[LoadingService]];
  }
}
