import { Component, ElementRef } from '@angular/core';
import { RainService           } from '../../services/rain.service';


@Component({
  selector: 'matrix-rain',
  inputs: ['raining', 'removeRain'],
  templateUrl: 'components/matrix-rain/matrix-rain.component.html'
})


export class MatrixRainComponent {
  constructor(matrixRain, rain) {
    this.rain       = rain;
    this.matrixRain = matrixRain.nativeElement;
  }

  ngOnChanges() {
    if (this.raining) {
      this.rain.setParams(isMobile ? 5 : 10);
      this.rain.createRain(this.matrixRain.firstElementChild);
    }

    if (this.removeRain) {
      this.matrixRain.remove();
    }
  }

  static get parameters() {
    return [
      [ElementRef],
      [RainService]
    ];
  }
}
