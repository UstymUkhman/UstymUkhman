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
  }

  init(room, scene, camera) {
    this.room   = room;
    this.scene  = scene;
    this.camera = camera;

    this.controls = new THREE.PointerLockControls(this.camera);
    this.scene.add(this.controls.getObject());

    this.pointerLock =
      this.room.requestPointerLock    ||
      this.room.mozRequestPointerLock ||
      this.room.webkitRequestPointerLock;

    document.exitPointerLock =
      document.exitPointerLock    ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;

    if (this.pointerLock) {
      this.room.requestPointerLock =
        this.room.requestPointerLock    ||
        this.room.mozRequestPointerLock ||
        this.room.webkitRequestPointerLock;

      this.addEventListeners();
    }

    return this.pointerLock;
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
        if (pressed) this.togglePointerLock();
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

  togglePointerLock() {
    if (!this.controls.enabled)
      this.room.requestPointerLock();
    else
      document.exitPointerLock();
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

    let nextStep = {
      x: this.velocity.x * delta,
      z: this.velocity.z * delta
    };

    if (true) { // if (this.checkNextMove(nextStep)) {
      this.controls.getObject().translateX(nextStep.x);
      this.controls.getObject().translateZ(nextStep.z);
    }

    this.prevTime = time;
  }

  checkNextMove(nextStep) {
    let currentPosition = this.controls.getObject().position,
        nexrPosition    = {
          x: currentPosition.x + nextStep.x,
          z: currentPosition.z + nextStep.z
        };

    return (nexrPosition.x > -50)  && (nexrPosition.x <  50) &&
           (nexrPosition.z > -250) && (nexrPosition.z < 250);
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
