'use strict';

import { Object3D, Euler, Vector3 } from 'three';


export class PointerControls {
  constructor(camera, height) {
    this.enabled = false;
    camera.rotation.set(0, 0, 0);

    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.position.y = height || 10;
    this.yawObject.add(this.pitchObject);

    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.getDirection();
  }

  onMouseMove() {
    if (!this.enabled) return;

    const PI_2    = Math.PI / 2;
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0,
        movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.yawObject.rotation.y   -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;
    this.pitchObject.rotation.x  = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
  }

  getDirection() {
    let rotation  = new Euler(0, 0, 0, 'YXZ');
    let direction = new Vector3(0, 0, -1);

    return (verse) => {
      rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);
      verse.copy(direction).applyEuler(rotation);
      return verse;
    };
  }

  getObject() {
    return this.yawObject;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
  }
}

