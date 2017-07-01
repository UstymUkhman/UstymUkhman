import { Component      } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector    : 'console',
  templateUrl : 'components/console/console.component.html'
})


export class ConsoleComponent {
  constructor(loading) {
    this.menuReady      = false;
    this.overlayReady   = false;
    this.contentLoaded  = false;

    this.showMessage    = false;
    this.showConsole    = false;
    this.hiddenLoading  = false;
    this.visibleOverlay = false;
    this.lastActiveItem = loading.getLastItem();

    if (this.lastActiveItem !== null) {
      this.loadingFinished();
    }
  }

  runCodeOverlay() {
    this.overlayReady = true;
  }

  codeRunned(ready) {
    this.menuReady = ready;
  }

  loadingFinished() {
    this.showConsole    = true;
    this.contentLoaded  = true;
    this.visibleOverlay = true;
  }

  ngAfterViewInit() {
    this.hiddenLoading = this.lastActiveItem === null;

    if (this.contentLoaded) {
      this.showConsole    = true;
      this.visibleOverlay = true;
    }

    if (this.lastActiveItem !== null) {
      this.codeRunned(true);
    }
  }

  static get parameters() {
    return [[LoadingService]];
  }
}
