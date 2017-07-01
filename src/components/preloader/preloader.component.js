import { Component, EventEmitter, ElementRef } from '@angular/core';


@Component({
  outputs: ['loaded'],
  selector: 'preloader',
  template: `
    <canvas id="preloader" width="{{ width }}" height="{{ height }}"></canvas>
  `
})


export class PreloaderComponent {
  constructor(preloader) {
    this.PI_2       = Math.PI * 2;
    this.width      = window.innerWidth;
    this.height     = window.innerHeight;

    this.halfWidth  = this.width  / 2;
    this.halfHeight = this.height / 2;

    this.loaded     = new EventEmitter();
    this.preloader  = preloader.nativeElement;

    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  initDrawing() {
    this.radius  = this.width > this.height ? this.halfWidth * 1.2 : this.halfHeight * 1.2;
    this.drawingTime = Date.now();

    const canvas = this.preloader.children[0];
    this.context = canvas.getContext('2d');

    requestAnimationFrame(this.animate.bind(this));
  }

  drawCircle() {
    this.context.beginPath();
    this.context.arc(this.halfWidth, this.halfHeight, this.radius, 0, this.PI_2);
    this.context.fillStyle = '#FFFFFF';

    this.context.stroke();
    this.context.fill();
  }

  animate() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.radius -= ((Date.now() - this.drawingTime) / 1000 * 75);

    if (this.radius > 0) {
      this.drawCircle();
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.loaded.emit(true);
      this.preloader.remove();
    }
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
  }

  ngOnInit() {
    this.initDrawing();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
