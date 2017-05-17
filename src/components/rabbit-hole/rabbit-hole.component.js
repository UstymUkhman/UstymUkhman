import * as THREE                from 'three';
import { Component, ElementRef } from '@angular/core';
import { ControlsService       } from '../../services/controls.service';


@Component({
  template: '',
  selector: 'rabbit-hole'
})


export class RabbitHoleComponent {
  constructor(rabbitHole, cameraControls) {
    this.scene     = null;
    this.camera    = null;
    this.renderer  = null;

    this.WHITE     = 0xFFFFFF;
    this.LIGHTGRAY = 0xDDDDDD;
    this.DARKGRAY  = 0x333333;
    this.BLACK     = 0x000000;

    this.intro     = false;
    this.error     = false;
    this.halfPI    = Math.PI / 2;
    this.WIDTH     = window.innerWidth;
    this.HEIGHT    = window.innerHeight;

    this.hole      = rabbitHole.nativeElement;
    this.controls  = cameraControls;

    this.createScene();
    this.createCamera();
    this.createLight();

    this.createSky();
    this.createFloor();
    this.createWalls();
    this.createCeiling();

    // this.createComputer();
    // this.createDoor();

    // this.createCinematicIntro();
    this.createEventHandlers();
    this.createRenderer();
    this.createControls();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(50, this.WIDTH / this.HEIGHT, 1, 1000);
    this.scene.add(this.camera);
  }

  createLight() {
    this.scene.add(new THREE.AmbientLight(this.DARKGRAY));
  }

  createControls() {
    this.error = this.controls.init(this.renderer.domElement, this.scene, this.camera);

    if (this.error) {
      console.error(
        `Your shitty browser does not support Pointer Lock API.\n
        You need to update it or use a better one: https://www.google.it/chrome/browser/desktop/`
      );
    }

    this.controls.setBorders({
      front : 250,
      right :  20,
      left  : -20,
      back  : 250
    });
  }

  createSky() {
    let skyMaterial = new THREE.MeshBasicMaterial({ color: 0x168BDE, side: THREE.BackSide }),
        skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000),
        sky         = new THREE.Mesh(skyGeometry, skyMaterial);

    this.scene.fog = new THREE.FogExp2(0xC2C2C2, 0.0002);
    this.scene.add(sky);
  }

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/floor.jpg', (texture) => {

      let floorTexture   = texture;
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(1, 10);

      let floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide }),
          floorGeom     = new THREE.PlaneGeometry(50, 500, 1, 20),
          floor         = new THREE.Mesh(floorGeom, floorMaterial);

      floor.rotation.x = Math.PI / 2;
      floor.position.y = -12.5;
      this.scene.add(floor);
    });
  }

  createWalls() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/wall.jpg', (texture) => {

      let wallTexture   = texture;
      wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.repeat.set(5, 1);

      let wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.DoubleSide }),
          wallGeometry = new THREE.PlaneGeometry(500, 65, 1, 10),

          leftWall     = new THREE.Mesh(wallGeometry, wallMaterial),
          rightWall    = new THREE.Mesh(wallGeometry, wallMaterial);

      leftWall.rotation.y  = this.halfPI;
      leftWall.rotation.x  = Math.PI;
      leftWall.position.y  = 18.5;
      leftWall.position.x  = -25;

      rightWall.rotation.y = this.halfPI;
      rightWall.rotation.x = Math.PI;
      rightWall.position.y = 18.5;
      rightWall.position.x = 25;

      this.scene.add(rightWall);
      this.scene.add(leftWall);
    });
  }

  createCeiling() {
    let ceiling = new THREE.RectAreaLight(this.WHITE, 1, 50, 500);
    ceiling.intensity = 100;
    this.scene.add(ceiling);

    let ceilingHelper = new THREE.RectAreaLightHelper(ceiling);
    ceilingHelper.position.set(0, 50, 0);
    ceilingHelper.rotateX(Math.PI / 2);
    this.scene.add(ceilingHelper);
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
      let texture = new THREE.TextureLoader().load('assets/wood.jpg');
      let door = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        // new THREE.MeshStandardMaterial({
        //   shading           : THREE.SmoothShading,
        //   emissive          : this.BLACK,
        //   color             : this.WHITE,
        //   emissiveIntensity : 1,

        //   roughness         : 0.2,
        //   metalness         : 0,
        //   opacity           : 1,

        //   depthTest         : true,
        //   depthWrite        : true,
        //   transparent       : false
        // })
      );

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
    this.rotationStep = 0.0031416;
    this.rotationStepCounter = 0;
    this.elapsedSpeed = 4.5;

    setTimeout(() => {
      this.camera.rotation.x = -Math.PI / 4;
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

    if (this.rotationStepCounter < 250) {
      this.camera.rotation.x += this.rotationStep;
      this.rotationStepCounter++;
    }

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
