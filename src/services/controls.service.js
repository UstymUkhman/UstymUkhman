import * as THREE from 'three';
window.THREE = THREE;

require('three/examples/js/controls/PointerLockControls');


export class ControlsService {
  constructor() {
    this.rotation  = new THREE.Vector2();
    this.velocity  = new THREE.Vector3();
    this.prevTime  = performance.now();
    this.enabled   = false;

    this.controls  = null;
    this.camera    = null;
    this.scene     = null;
    this.room      = null;

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
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);

    this.room.addEventListener('mousemove', this.updateCameraRotation.bind(this), false);
    this.room.addEventListener('click', this.togglePointerLock.bind(this), false);

    document.addEventListener('webkitpointerlockchange', this.changePointerLock.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.changePointerLock.bind(this), false);
    document.addEventListener('pointerlockchange', this.changePointerLock.bind(this), false);

    document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
    document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
    document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
  }

  updateCameraRotation(event) {
    this.rotation.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rotation.x =  (event.clientX / window.innerWidth)  * 2 - 1;

    // console.log(this.rotation);
    // if x or y touches walls, block rotation in one direction:
    // if this.rotation.x > LEFT_WALL --> this.enabled = false (& save last x)
    // if this.rotation.x < last.x --> this.enabled = true
  }

  togglePointerLock() {
    if (!this.controls.enabled)
      this.room.requestPointerLock();
    else
      document.exitPointerLock();
  }

  changePointerLock() {
    this.controls.enabled = !this.controls.enabled;
  }

  pointerLockError(event) {
    console.error('A \'pointerlockerror\' occured... D:', event);
  }

  onKeyDown(event) {
    this.keyHandler(event.keyCode, true);
  }

  onKeyUp(event) {
    this.keyHandler(event.keyCode, false);
  }

  keyHandler(code, pressed) {
    switch(code) {
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

  update() {
    if (!this.controls.enabled) return;

    let time  = performance.now(),
        delta = (time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x *  10.0 * delta;
    this.velocity.z -= this.velocity.z *  10.0 * delta;

    if (this.move.forward)  this.velocity.z -= 500.0 * delta;
    if (this.move.backward) this.velocity.z += 500.0 * delta;

    if (this.move.left)     this.velocity.x -= 500.0 * delta;
    if (this.move.right)    this.velocity.x += 500.0 * delta;

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);

    this.prevTime = time;
  }

  remove() {
    this.room.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}

// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
