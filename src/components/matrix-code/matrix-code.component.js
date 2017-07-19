import { Component, EventEmitter, ElementRef } from '@angular/core';
import { RainService                         } from '../../services/rain.service';


@Component({
  inputs: ['runOverlay'],
  outputs: ['codeRunned'],
  selector: 'matrix-code',
  templateUrl: 'components/matrix-code/matrix-code.component.html'
})


export class MatrixCodeComponent {
  constructor(matrixCode, rain) {
    this.matrixCode    = matrixCode.nativeElement;
    this.rain          = rain;

    this.codeRunned    = new EventEmitter();
    this.codeAnimation = 'setup-animation';
  }

  ngAfterViewInit() {
    // this.rain.setParams(150);
    this.rain.setParams(isMobile ? 50 : 150);
    this.rain.createRain(this.matrixCode.firstElementChild.firstElementChild);
  }

  ngOnChanges() {
    if (this.runOverlay) {
      this.codeAnimation = 'run-animation';

      setTimeout(() => {
        this.codeRunned.emit(true);
        this.matrixCode.remove();
      }, 8500);
    }
  }

  static get parameters() {
    return [[ElementRef], [RainService]];
  }
}
