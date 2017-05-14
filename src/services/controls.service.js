import * as THREE from 'three';
window.THREE = THREE;

require('three/examples/js/controls/PointerLockControls');


export class ControlsService {
  constructor() {
    this.rotation  = new THREE.Vector2();
    this.velocity  = new THREE.Vector3();
    this.prevTime  = performance.now();
    this.enabled   = true;

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

    // this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
    this.controls  = new THREE.PointerLockControls(this.camera);
    this.controls.enabled = true;
    this.scene.add(this.controls.getObject());

    this.room.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  onMouseMove(event) {
    this.rotation.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rotation.x =  (event.clientX / window.innerWidth)  * 2 - 1;

    // console.log(this.rotation);
    // if x or y touches walls, block rotation in one direction:
    // if this.rotation.x > LEFT_WALL --> this.enabled = false (& save last x)
    // if this.rotation.x < last.x --> this.enabled = true
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
    if (!this.enabled) return;

    // this.raycaster.ray.origin.copy(this.controls.getObject().position);
    // this.raycaster.ray.origin.y -= 10;

    let time  = performance.now(),
        delta = (time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x *  10.0 * delta;
    this.velocity.z -= this.velocity.z *  10.0 * delta;
    // this.velocity.y -= 9.8             * 100.0 * delta;

    if (this.move.forward)  this.velocity.z -= 500.0 * delta;
    if (this.move.backward) this.velocity.z += 500.0 * delta;

    if (this.move.left)     this.velocity.x -= 500.0 * delta;
    if (this.move.right)    this.velocity.x += 500.0 * delta;

    this.controls.getObject().translateX(this.velocity.x * delta);
    // this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);

    /*if (this.controls.getObject().position.y < 10) {
      this.controls.getObject().position.y = 10;
      this.velocity.y = 0;
    }*/

    this.prevTime = time;
  }

  remove() {
    this.room.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}

// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
