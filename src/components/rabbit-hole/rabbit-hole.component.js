import * as THREE                from 'three';
import { Component, ElementRef } from '@angular/core';
import { ControlsService       } from '../../services/controls.service';

// let OrbitControls = require('three-orbit-controls')(THREE);


@Component({
  template: '',
  selector: 'rabbit-hole'
})


export class RabbitHoleComponent {
  constructor(rabbitHole, cameraControls) {
    this.scene      = null;
    this.camera     = null;
    this.renderer   = null;

    this.WHITE      = 0xFFFFFF;
    this.LIGHTGRAY  = 0xDDDDDD;
    this.DARKGRAY   = 0x333333;
    this.BLACK      = 0x000000;

    this.intro      = false;
    this.error      = false;
    this.WIDTH      = window.innerWidth;
    this.HEIGHT     = window.innerHeight;

    this.hole       = rabbitHole.nativeElement;
    this.controls   = cameraControls;
    this.translateZ = 225;

    this.createScene();
    this.createCamera();
    // this.createLight();

    this.createFloor();
    this.createWalls();
    this.createCeiling();

    // this.createComputer();
    // this.createTable();
    // this.createDoor();

    // this.createCinematicIntro();
    this.createEventHandlers();
    this.createRenderer();

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.createControls();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(50, this.WIDTH / this.HEIGHT, 1, 1000);
    // this.camera.position.z = 300;
    this.scene.add(this.camera);
  }

  // createLight() {
  //   this.scene.add(new THREE.AmbientLight(this.DARKGRAY));
  // }

  createControls() {
    this.error = this.controls.init(this.renderer.domElement, this.scene, this.camera);

    if (this.error) {
      console.error(
        `Your shitty browser does not support Pointer Lock API.\n
        You need to update it or use a better one: https://www.google.it/chrome/browser/desktop/`
      );
    }

    this.controls.setBorders({
      front : this.translateZ - 245,
      back  : this.translateZ + 245,
      right :  20,
      left  : -20
    });
  }

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/floor.jpg', (texture) => {

      let floorTexture   = texture;
      floorTexture.wrapS = floorTexture.wrapT = THREE.MirroredRepeatWrapping;
      floorTexture.repeat.set(1, 10);

      let floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture }),
          floorGeom     = new THREE.PlaneGeometry(50, 500, 1, 20),
          floor         = new THREE.Mesh(floorGeom, floorMaterial);

      floor.position.z = this.translateZ;
      floor.rotation.x = Math.PI / 2;
      floor.rotation.y = Math.PI;
      floor.position.y = -12.5;

      this.scene.add(floor);
    });
  }

  createWalls() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/wall.jpg', (texture) => {

      const PI_2 = Math.PI / 2;

      let directTexture = texture.clone(),
          sideTexture   = texture.clone();

      directTexture.wrapS = directTexture.wrapT = THREE.MirroredRepeatWrapping;
      sideTexture.wrapS   = sideTexture.wrapT   = THREE.MirroredRepeatWrapping;

      directTexture.needsUpdate = true;
      sideTexture.needsUpdate   = true;

      directTexture.repeat.set(1, 1);
      sideTexture.repeat.set(10, 1);

      let directGeometry = new THREE.PlaneGeometry( 50, 65, 1, 10),
          sideGeometry   = new THREE.PlaneGeometry(500, 65, 1, 10);

      let directMaterial = new THREE.MeshBasicMaterial({ map: directTexture }),
          sideMaterial   = new THREE.MeshBasicMaterial({ map: sideTexture });

      let frontWall      = new THREE.Mesh(directGeometry, directMaterial),
          backWall       = new THREE.Mesh(directGeometry, directMaterial),
          leftWall       = new THREE.Mesh(sideGeometry,   sideMaterial),
          rightWall      = new THREE.Mesh(sideGeometry,   sideMaterial);

      frontWall.position.set(0, 18.5, this.translateZ - 250);

      backWall.position.set(0, 18.5, this.translateZ + 250);
      backWall.rotateY(Math.PI);

      leftWall.position.set(-25, 18.5, this.translateZ);
      leftWall.rotateY(PI_2);

      rightWall.position.set(25, 18.5, this.translateZ);
      rightWall.rotateY(-PI_2);

      this.scene.add(frontWall);
      this.scene.add(rightWall);
      this.scene.add(backWall);
      this.scene.add(leftWall);
    });
  }

  createCeiling() {
    const PI_2 = Math.PI / 2;

    let ceiling = new THREE.RectAreaLight(this.WHITE, 1, 50, 500);
    ceiling.intensity = 100;

    let ceilingHelper = new THREE.RectAreaLightHelper(ceiling);
    ceilingHelper.position.set(0, 51, this.translateZ);
    ceilingHelper.rotateX(PI_2);

    this.scene.add(ceilingHelper);
    this.scene.add(ceiling);

    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/ceiling.png', (texture) => {

      let directTexture = texture.clone(),
          sideTexture   = texture.clone();

      directTexture.wrapS = directTexture.wrapT = THREE.MirroredRepeatWrapping;
      sideTexture.wrapS   = sideTexture.wrapT   = THREE.MirroredRepeatWrapping;

      directTexture.needsUpdate = true;
      sideTexture.needsUpdate   = true;

      directTexture.repeat.set(1, 1);
      sideTexture.repeat.set(10, 1);

      let directGeometry = new THREE.PlaneGeometry( 50, 6, 1, 10),
          sideGeometry   = new THREE.PlaneGeometry(500, 6, 1, 10);

      let directMaterial = new THREE.MeshBasicMaterial({ map: directTexture }),
          sideMaterial   = new THREE.MeshBasicMaterial({ map: sideTexture });

      let frontCeil      = new THREE.Mesh(directGeometry, directMaterial),
          backCeil       = new THREE.Mesh(directGeometry, directMaterial),
          leftCeil       = new THREE.Mesh(sideGeometry,   sideMaterial),
          rightCeil      = new THREE.Mesh(sideGeometry,   sideMaterial);

      frontCeil.position.set(0, 50.6, this.translateZ - 247);
      frontCeil.rotateX(PI_2);

      backCeil.position.set(0, 50.6, this.translateZ + 247);
      backCeil.rotation.set(PI_2, 0, -Math.PI);

      leftCeil.position.set(-22, 50.4, this.translateZ);
      leftCeil.rotation.set(PI_2, 0, -PI_2);

      rightCeil.position.set(22, 50.4, this.translateZ);
      rightCeil.rotation.set(PI_2, 0, PI_2);

      this.scene.add(frontCeil);
      this.scene.add(rightCeil);
      this.scene.add(backCeil);
      this.scene.add(leftCeil);
    });
  }

  createComputer() {
    const jsonLoader = new THREE.JSONLoader();

    jsonLoader.load('assets/Monitor.json', (geometry) => {
      let computer = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color     : this.LIGHTGRAY,
          roughness : 0.5,
          metalness : 0,
        })
      );

      this.scene.add(computer);
    });
  }

  createDoor() {
    const jsonLoader = new THREE.JSONLoader();

    jsonLoader.load('assets/door.json', (geometry) => {
      let texture = new THREE.TextureLoader().load('assets/wood.jpg'),
          door    = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));

      door.position.set(0, 0, 500);
      door.scale.set(50, 50, 50);
      door.rotateY(Math.PI);

      this.scene.add(door);
    });
  }

  setResizeHandler() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  createCinematicIntro() {
    this.clock = new THREE.Clock();
    // this.rotationStep = 0.0031416;
    // this.rotationStepCounter = 0;
    this.elapsedSpeed = 4.5;

    setTimeout(() => {
      // this.camera.rotation.x = -Math.PI / 4;
      this.intro = true;
    }, 1000);
  }

  createEventHandlers() {
    window.addEventListener('resize', this.setResizeHandler.bind(this), false);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.hole.appendChild(this.renderer.domElement);
    this.renderer.domElement.focus();
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (this.intro) {
      this.animateCameraIntro();
    }
  }

  animateCameraIntro() {
    this.camera.fov = this.getCameraFov();

    // if (this.rotationStepCounter < 250) {
    //   this.camera.rotation.x += this.rotationStep;
    //   this.rotationStepCounter++;
    // }

    if (this.camera.fov === 75) {
      this.camera.rotation.x = 0;
      this.intro = false;
    }

    this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
    this.renderer.setScissor(0, 0, this.WIDTH, this.HEIGHT);
    this.camera.updateProjectionMatrix();
  }

  getCameraFov() {
    this.elapsedSpeed += this.camera.fov < 70 ? 0.0125 : 0.005;

    let elapsedTime = this.clock.getElapsedTime(),
        zoomSpeed   = elapsedTime * this.elapsedSpeed,
        cameraFov   = zoomSpeed + 50;

    return (cameraFov < 75) ? cameraFov : 75;
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setResizeHandler.bind(this), false);
    cancelAnimationFrame(this.frame);
    this.controls.dispose();
  }

  static get parameters() {
    return [[ElementRef], [ControlsService]];
  }
}

// http://stackoverflow.com/questions/17939188/how-can-i-load-multiple-textures-materials-to-a-model-using-three-js
// http://stackoverflow.com/questions/16781064/three-js-multiple-materials-on-object-loaded-via-objmtlloader
// http://stackoverflow.com/questions/26087620/three-js-tile-which-has-multiple-textures-using-plane-geometry
// http://stackoverflow.com/questions/16781064/three-js-multiple-materials-on-object-loaded-via-objmtlloader/16781472
// http://stackoverflow.com/questions/16287547/multiple-transparent-textures-on-the-same-mesh-face-in-three-js
