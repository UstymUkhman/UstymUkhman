import { Component } from '@angular/core';


@Component({
  selector    : 'console',
  templateUrl : 'components/console/console.component.html'
})


export class ConsoleComponent {
  constructor() {
    this.menuReady      = false;
    this.codeIsReady    = false;
    this.overlayReady   = false;
    this.consoleIsReady = false;

    this.showConsole    = false;
    this.hiddenLoading  = false;
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
    this.showConsole = true;

    setTimeout(() => {
      this.hiddenLoading = true;
    }, 100);
  }
}
