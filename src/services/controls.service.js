import { Vector3 } from 'three';
import { PointerControls } from '../classes/PointerControls';


export class ControlsService {
  constructor() {
    this.prevTime = performance.now();
    this.velocity = new Vector3();
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

    this.controls = new PointerControls(this.camera);
    this.scene.add(this.controls.getObject());
    this.setExperimentalAPIs();

    return !this.pointerLock;
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

  checkCollision(current) {
    if (current.position.z < this.borders.front) return true;
    if (current.position.z > this.borders.back)  return true;
    if (current.position.x > this.borders.right) return true;
    if (current.position.x < this.borders.left)  return true;

    return false;
  }

  checkMovement() {
    return this.move.forward || this.move.backward || this.move.left || this.move.right;
  }

  checkDirectionChange() {
    const FRONT_LEFT_X = -0.5, FRONT_RIGHT_X =  0.5,
          BACK_RIGHT_X =  0.5, BACK_LEFT_X   = -0.5;

    const FRONT_LEFT_Z = -0.5, FRONT_RIGHT_Z = -0.5,
          BACK_RIGHT_Z =  0.5, BACK_LEFT_Z   =  0.5;

    const LAST_DIRECTION = this.getLastDirection();
    const FRONT = 1, RIGHT = 2, BACK = 3, LEFT = 4;

    this.look = {
      FRONT : false, RIGHT : false,
      BACK  : false, LEFT  : false
    };

    this.look.FRONT = (FRONT_LEFT_X  < this.direction.x < FRONT_RIGHT_X && this.direction.z < FRONT_RIGHT_Z   );
    this.look.RIGHT = (FRONT_RIGHT_Z < this.direction.z < BACK_RIGHT_Z  && BACK_RIGHT_X     < this.direction.x);
    this.look.BACK  = (BACK_RIGHT_X  > this.direction.x > BACK_LEFT_X   && BACK_LEFT_Z      < this.direction.z);
    this.look.LEFT  = (BACK_LEFT_Z   > this.direction.z > FRONT_LEFT_Z  && this.direction.x < FRONT_LEFT_X    );

         if (this.look.FRONT && LAST_DIRECTION !== FRONT) return this.look.FRONT;
    else if (this.look.RIGHT && LAST_DIRECTION !== RIGHT) return this.look.RIGHT;
    else if (this.look.BACK  && LAST_DIRECTION !== BACK ) return this.look.BACK;
    else if (this.look.LEFT  && LAST_DIRECTION !== LEFT ) return this.look.LEFT;

    return false;
  }

  getLastDirection() {
    if (this.look.FRONT) return 1;
    if (this.look.RIGHT) return 2;
    if (this.look.BACK ) return 3;
    if (this.look.LEFT ) return 4;
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

  dispose() {
    document.removeEventListener('webkitpointerlockchange', this.changePointerLock.bind(this), false);
    document.removeEventListener('mozpointerlockchange', this.changePointerLock.bind(this), false);
    document.removeEventListener('pointerlockchange', this.changePointerLock.bind(this), false);

    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);

    document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
    document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
  }
}
