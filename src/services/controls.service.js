import { Vector3         } from 'three';
import { PointerControls } from '../classes/PointerControls';


export class ControlsService {
  constructor() {
    this.isEdge       = navigator.appVersion.includes('Edge');
    this.prevTime     = performance.now();

    this.direction    = new Vector3();
    this.velocity     = new Vector3();

    this.inFullscreen = false;
    this.enabled      = false;

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
    this.room    = room;
    this.scene   = scene;
    this.camera  = camera;
    this.enabled = true;

    this.controls = new PointerControls(this.camera);
    this.scene.add(this.controls.getObject());
    this.setExperimentalAPIs();

    return !(this.fullscreen && this.pointerLock);
  }

  setExperimentalAPIs() {
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
      document.exitFullscreen      ||
      document.mozCancelFullScreen ||
      document.webkitCancelFullScreen;

    document.exitPointerLock =
      document.exitPointerLock    ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
  }

  onFullscreenCallback(callback = null) {
    this.goFullscreenCallback = callback;
  }

  outFullscreenCallback(callback = null) {
    this.exitFullscreenCallback = callback;
  }

  setBorders(borders) {
    this.borders = borders;
  }

  changePointerLock() {
    if (this.isEdge) return;
    this.controls.enabled = !this.enabled;

    if (this.isFullscreen() && this.exitFullscreenCallback) {
      this.exitFullscreenCallback();
    }
  }

  pointerLockError(event) {
    console.error('\'pointerlockerror\' event occured...', event);
    if (this.isEdge) this.enable(false);
  }

  enable(enable = true) {
    this.controls.enabled = enable;
    this.enabled = enable;
  }

  setFullscreenMode(fullscreen = true) {
    if (fullscreen) {
      this.room.requestPointerLock();

      if (this.isEdge) this.enableEdgeControls(true);
      else this.room.requestFullscreen();

    } else {
      document.exitPointerLock();

      if (this.isEdge) this.enableEdgeControls(false);
      else document.exitFullscreen();
    }
  }

  enableEdgeControls(enable) {
    this.inFullscreen = enable;
    this.enable(enable);
  }

  isFullscreen() {
    return this.isEdge ? this.inFullscreen : document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
  }

  getCameraDirection() {
    this.direction.normalize();
    return this.controls.getDirection(this.direction);
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

    if (!this.checkMovement()) return this.prevTime = time;

    let position = this.controls.getObject();
    let step = {
      x: this.velocity.x * delta,
      z: this.velocity.z * delta
    };

    position.translateX(step.x);
    position.translateZ(step.z);

    if (this.checkCollision(position)) {
      position.translateX(-step.x);
      position.translateZ(-step.z);
    }

    this.prevTime = time;
  }

  checkMovement() {
    return this.move.forward || this.move.backward || this.move.left || this.move.right;
  }

  checkCollision(current) {
    if (current.position.z < this.borders.front) return true;
    if (current.position.z > this.borders.back)  return true;
    if (current.position.x > this.borders.right) return true;
    if (current.position.x < this.borders.left)  return true;

    return false;
  }

  keyDownHandler(event) {
    this.keyHandler(event.keyCode, true);
  }

  keyUpHandler(event) {
    this.keyHandler(event.keyCode, false);
  }

  keyHandler(code, pressed) {
    switch(code) {
      case 27:
        if (this.isEdge) this.setFullscreenMode(false);
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

  addEventListeners() {
    this.onChangePointerLock = this.changePointerLock.bind(this);
    this.onPointerLockError = this.pointerLockError.bind(this);

    this.onKeyDown = this.keyDownHandler.bind(this);
    this.onKeyUp = this.keyUpHandler.bind(this);

    document.addEventListener('webkitpointerlockchange', this.onChangePointerLock, false);
    document.addEventListener('mozpointerlockchange', this.onChangePointerLock, false);
    document.addEventListener('pointerlockchange', this.onChangePointerLock, false);

    document.addEventListener('webkitpointerlockerror', this.onPointerLockError, false);
    document.addEventListener('mozpointerlockerror', this.onPointerLockError, false);
    document.addEventListener('pointerlockerror', this.onPointerLockError, false);

    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);
  }

  dispose() {
    document.removeEventListener('webkitpointerlockchange', this.onChangePointerLock, false);
    document.removeEventListener('mozpointerlockchange', this.onChangePointerLock, false);
    document.removeEventListener('pointerlockchange', this.onChangePointerLock, false);

    document.removeEventListener('webkitpointerlockerror', this.onPointerLockError, false);
    document.removeEventListener('mozpointerlockerror', this.onPointerLockError, false);
    document.removeEventListener('pointerlockerror', this.onPointerLockError, false);

    document.removeEventListener('keydown', this.onKeyDown, false);
    document.removeEventListener('keyup', this.onKeyUp, false);

    this.setFullscreenMode(false);
    this.controls.dispose();
  }
}
