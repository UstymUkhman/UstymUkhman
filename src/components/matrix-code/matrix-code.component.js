import { Component, EventEmitter, ElementRef } from '@angular/core';
import { RainService                         } from '../../services/rain.service';


@Component({
  selector: 'matrix-code',
  outputs: ['codeReady', 'codeRuned'],
  inputs: ['runOverlay', 'resetCode', 'removeCode'],
  templateUrl: 'components/matrix-code/matrix-code.component.html'
})


export class MatrixCodeComponent {
  constructor(matrixCode, rain) {
    this.matrixCode    = matrixCode.nativeElement;
    this.rain          = rain;

    this.codeReady     = new EventEmitter();
    this.codeRuned     = new EventEmitter();
    this.codeAnimation = 'setup-animation';
  }

  ngAfterViewInit() {
    this.rain.setParams(150);
    this.rain.createRain(this.matrixCode.firstElementChild.firstElementChild);
    this.codeReady.emit(true);
  }

  ngOnChanges() {
    if (this.runOverlay) {
      this.codeAnimation = 'run-animation';

      setTimeout(() => {
        this.codeRuned.emit(true);

        if (this.removeCode) {
          this.matrixCode.remove();
        }
      }, 5500);
    }

    if (this.resetCode) {
      this.initializeCode();
    }
  }

  static get parameters() {
    return [[ElementRef], [RainService]];
  }
}
