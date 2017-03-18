import {Component, EventEmitter, ElementRef} from '@angular/core';


@Component({
  selector: 'matrix-code',
  outputs: ['codeReady', 'codeRuned'],
  inputs: ['runOverlay', 'resetCode', 'removeCode'],
  templateUrl: 'components/matrix-code/matrix-code.component.html'
})


export class MatrixCodeComponent {
  constructor(matrixCode) {
    this.matrixCode = matrixCode.nativeElement;
    this.initializeCode();
  }

  initializeCode() {
    this.code          = new Array(150);
    this.codeReady     = new EventEmitter();
    this.codeRuned     = new EventEmitter();

    this.codeAnimation = 'setup-animation';
    this.lastCode      = this.code.length - 1;

    this.generateCharCodes();
  }

  generateCharCodes() {
    for (let i = 0; i < this.code.length; i++) {
      this.setCharCode(i);
    }

    setTimeout(() => {
      this.codeReady.emit(true);
    });
  }

  setCharCode(index) {
    let charCode = this.getCharCodes(),
        charSize = Math.floor(Math.random() * 13);

    if (charSize < 10)
      charSize = 25;
    else if (charSize < 12)
      charSize = 12;
    else
      charSize = 60;

    this.code[index]      = charCode;
    this.code[index].size = charSize;
  }

  getCharCodes() {
    let matrixCodes = Array.from(
      new Array(50), () => {
        return this.getCharCode();
      }
    );

    return {
      size: 25,
      codes: matrixCodes
    };
  }

  getCharCode() {
    let code = Math.floor(Math.random() * 94 + 33);

    return (code === 64)
      ? String.fromCharCode(47)
      : String.fromCharCode(code);
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
    return [[ElementRef]];
  }
}
