import * as THREE from 'three';
window.THREE = THREE;

require('three/examples/js/controls/PointerLockControls');


export class ControlsService {
  constructor() {
    this.velocity = new THREE.Vector3();
    this.prevTime = performance.now();
    this.enabled  = false;

    this.controls = null;
    this.camera   = null;
    this.scene    = null;
    this.room     = null;

    this.move = {
      backward : false,
      forward  : false,
      right    : false,
      left     : false
    };

    this.free = {
      front : false,
      right : false,
      back  : false,
      left  : false
    };
  }

  init(room, scene, camera) {
    this.room   = room;
    this.scene  = scene;
    this.camera = camera;

    this.controls = new THREE.PointerLockControls(this.camera);
    this.scene.add(this.controls.getObject());

    this.fullscreen =
      this.room.requestFullscreen    ||
      this.room.msRequestFullscreen  ||
      this.room.mozRequestFullScreen ||
      this.room.webkitRequestFullscreen;

    this.pointerLock =
      this.room.requestPointerLock    ||
      this.room.mozRequestPointerLock ||
      this.room.webkitRequestPointerLock;

    if (this.fullscreen) {
      this.room.requestFullscreen =
        this.room.requestFullscreen    ||
        this.room.msRequestFullscreen  ||
        this.room.mozRequestFullScreen ||
        this.room.webkitRequestFullscreen;
    }

    if (this.pointerLock) {
      this.room.requestPointerLock =
        this.room.requestPointerLock    ||
        this.room.mozRequestPointerLock ||
        this.room.webkitRequestPointerLock;

      this.addEventListeners();
    }

    document.exitFullscreen =
      document.exitFullscreen         ||
      document.mozCancelFullScreen    ||
      document.webkitCancelFullScreen;

    document.exitPointerLock =
      document.exitPointerLock    ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;

    return !this.pointerLock;
  }

  addEventListeners() {
    document.addEventListener('webkitpointerlockchange', this.changePointerLock.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.changePointerLock.bind(this), false);
    document.addEventListener('pointerlockchange', this.changePointerLock.bind(this), false);

    document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
    document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
    document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);

    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  changePointerLock() {
    this.controls.enabled = !this.controls.enabled;
  }

  pointerLockError(event) {
    console.error('D:\nA \'pointerlockerror\' occured...', event);
  }

  onKeyDown(event) {
    this.keyHandler(event.keyCode, true);
  }

  onKeyUp(event) {
    this.keyHandler(event.keyCode, false);
  }

  keyHandler(code, pressed) {
    switch(code) {
      case 32:
        if (pressed) this.setGameMode();
      break;

      case 40: case 83:
        this.move.backward = pressed;
      break;

      case 38: case 87:
        this.move.forward = pressed;
      break;

      case 39: case 68:
        this.move.right = pressed;
      break;

      case 37: case 65:
        this.move.left = pressed;
      break;
    }
  }

  setGameMode() {
    if (!this.controls.enabled) {
      this.room.requestPointerLock();
      this.room.requestFullscreen();
    } else {
      document.exitPointerLock();
      document.exitFullscreen();
    }
  }

  setBorders(borders) {
    this.borders = borders;
  }

  update() {
    if (!this.controls.enabled) return;

    let time  = performance.now(),
        delta = (time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x * 10 * delta;
    this.velocity.z -= this.velocity.z * 10 * delta;

    if (this.move.forward)  this.velocity.z -= 600 * delta;
    if (this.move.backward) this.velocity.z += 500 * delta;

    if (this.move.left)     this.velocity.x -= 500 * delta;
    if (this.move.right)    this.velocity.x += 500 * delta;

    if (this.checkNextMove(delta)) {
      this.controls.getObject().translateX(this.velocity.x * delta);
      this.controls.getObject().translateZ(this.velocity.z * delta);
    }

    this.prevTime = time;
  }

  checkNextMove(delta) {
    let nextStep     = this.estimateNextStep(delta),
        nextPosition = {
          x: this.controls.getObject().position.x + nextStep.x,
          z: this.controls.getObject().position.z + nextStep.z
        };

    this.free.front = nextPosition.z < this.borders.front;
    this.free.back  = nextPosition.z < this.borders.back;

    this.free.right = nextPosition.x < this.borders.right;
    this.free.left  = nextPosition.x > this.borders.left;

    return this.free.front && this.free.back && this.free.right && this.free.left;
  }

  estimateNextStep(delta) {
    let nextStep = {
      x: this.velocity.x - this.velocity.x * 10 * delta,
      z: this.velocity.z - this.velocity.z * 10 * delta
    };

    if (this.move.forward)  nextStep.z -= 600 * delta;
    if (this.move.backward) nextStep.z += 500 * delta;

    if (this.move.left)     nextStep.x -= 500 * delta;
    if (this.move.right)    nextStep.x += 500 * delta;

    let s = {
      x: nextStep.x * delta,
      z: nextStep.z * delta,
    };

    // console.log(s);
    return s;
  }

  remove() {
    document.removeEventListener('webkitpointerlockchange', this.changePointerLock.bind(this));
    document.removeEventListener('mozpointerlockchange', this.changePointerLock.bind(this));
    document.removeEventListener('pointerlockchange', this.changePointerLock.bind(this));

    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this));
    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this));
    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this));

    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}
