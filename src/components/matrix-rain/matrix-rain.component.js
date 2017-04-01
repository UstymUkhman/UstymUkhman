import {Component, ElementRef} from '@angular/core';


@Component({
  selector: 'matrix-rain',
  inputs: ['drops', 'raining', 'removeRain'],
  templateUrl: 'components/matrix-rain/matrix-rain.component.html'
})


export class MatrixRainComponent {
  constructor(matrixRain) {
    this.initialized = false;
    this.rain        = new Array(5);
    this.matrixRain  = matrixRain.nativeElement;
  }

  getCharCode() {
    let code = Math.floor(Math.random() * 94 + 33);

    return (code === 64)
      ? String.fromCharCode(47)
      : String.fromCharCode(code);
  }

  getCharCodes() {
    let matrixCodes = Array.from(
      new Array(50), () => {
        return this.getCharCode();
      }
    );

    return {
      size: 25,
      duration: 0,
      animation: '',
      updateId: null,
      codes: matrixCodes
    };
  }

  setCharCode(index) {
    let charCode = this.getCharCodes(),
        charSize = Math.floor(Math.random() * 13),
        duration = Math.floor(Math.random() * 14001 + 1000) / 1000;

    if (charSize < 10) {
      charSize = 25;
    } else if (charSize < 12) {
      charSize = 12;
    } else {
      charSize = 60;
    }

    this.rain[index]      = charCode;
    this.rain[index].size = charSize;

    this.animationTimeout = setTimeout(() => {
      let duration = Math.floor(Math.random() * 14001 + 1000);

      this.rain[index].animation = 'slide-down';
      this.rain[index].duration  = duration / 1000;

      this.charCodeTimeout = setTimeout(() => {
        this.setCharCode(index);
      }, duration);
    });
  }

  generateCharCodes() {
    for (let i = 0; i < this.rain.length; i++) {
      this.setCharCode(i);
    }
  }

  ngOnChanges() {
    if (this.drops) {
      this.rain = new Array(this.drops);
    }

    if (this.raining) {
      this.generateCharCodes();
      this.initialized = true;

    } else if (!this.raining && this.initialized) {
      this.raining     = false;
      this.initialized = false;
    }

    if (this.removeRain) {
      clearTimeout(this.animationTimeout);
      clearTimeout(this.charCodeTimeout);
      this.matrixRain.remove();
    }
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
