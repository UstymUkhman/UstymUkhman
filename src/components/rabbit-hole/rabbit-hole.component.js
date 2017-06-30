import * as THREE                from 'three';
import { Component, ElementRef } from '@angular/core';
import { ControlsService       } from '../../services/controls.service';

let OrbitControls = require('three-orbit-controls')(THREE);


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
    this.DARKGREEN  = 0x406550;
    this.DARKGRAY   = 0x333333;
    this.BLACK      = 0x000000;

    this.intro      = false;
    this.error      = false;
    this.WIDTH      = window.innerWidth;
    this.HEIGHT     = window.innerHeight;

    this.hole       = rabbitHole.nativeElement;
    this.loader     = new THREE.JSONLoader();
    this.controls   = cameraControls;
    this.center     = 225;

    this.createScene();
    this.createCamera();
    this.createLight();

    this.createFloor();
    this.createWalls();
    // this.createCeiling();

    // this.createComputer();
    this.createTable();
    // this.createDoor();

    this.createEventHandlers();
    this.createRenderer();

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.createControls();
    this.createMessage();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(25, this.WIDTH / this.HEIGHT, 1, 1000);
    this.camera.rotation.x = -Math.PI / 6;
    // this.camera.position.z = 300;
    this.scene.add(this.camera);
  }

  createLight() {
    // this.scene.add(new THREE.AmbientLight(this.LIGHTGRAY));

    const distance = 50;

    // this.hemiLight = new THREE.HemisphereLight(this.WHITE, this.WHITE, 0.6);
    // this.hemiLight.position.set(0, 50, this.center);
    // this.hemiLight.color.setHSL(0.8, 0.9, 0.8);
    // this.hemiLight.groundColor.setHSL(1, 1, 1);

    this.dirLight = new THREE.DirectionalLight(this.WHITE, 1);
    this.dirLight.position.multiplyScalar(50);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-1, 1.75, 1);
    // this.dirLight.position.set(0, 50, this.center);

    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.castShadow = false;

    this.dirLight.shadow.camera.bottom = -distance;
    this.dirLight.shadow.camera.right = distance;
    this.dirLight.shadow.camera.left = -distance;
    this.dirLight.shadow.camera.top = distance;
    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = -0.0001;

    // this.scene.add(this.hemiLight);
    this.scene.add(this.dirLight);
  }

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/floor.jpg', (texture) => {

      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.needsUpdate = true;

      let floorMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0,
        opacity: 0.75,

        transparent: true,
        color: this.DARKGREEN,
        premultipliedAlpha: true,
        shading: THREE.SmoothShading
      });

      let floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 500), floorMaterial);

      floor.position.set(0, -14, this.center);
      floor.rotation.x = -Math.PI / 2;
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

      frontWall.position.set(0, 18.5, this.center - 250);

      backWall.position.set(0, 18.5, this.center + 250);
      backWall.rotateY(Math.PI);

      leftWall.position.set(-25, 18.5, this.center);
      leftWall.rotateY(PI_2);

      rightWall.position.set(25, 18.5, this.center);
      rightWall.rotateY(-PI_2);

      this.scene.add(frontWall);
      this.scene.add(rightWall);
      this.scene.add(backWall);
      this.scene.add(leftWall);
    });
  }

  createCeiling() {
    const PI_2 = Math.PI / 2;
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 500),
      new THREE.MeshBasicMaterial({ color: this.WHITE })
    );

    ceiling.position.set(0, 51, this.center);
    ceiling.rotateX(PI_2);
    this.scene.add(ceiling);

    let frontCeilLoader = new THREE.TextureLoader();
    frontCeilLoader.load('assets/front_ceiling.jpg', (texture) => {

      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.needsUpdate = true;
      texture.repeat.set(1, 1);

      let material  = new THREE.MeshBasicMaterial({ map: texture }),
          geometry  = new THREE.PlaneGeometry( 50, 6, 1, 10),
          frontCeil = new THREE.Mesh(geometry, material),
          backCeil  = frontCeil.clone();

      frontCeil.position.set(0, 50.8, this.center - 247);
      frontCeil.rotateX(PI_2);

      backCeil.position.set(0, 50.8, this.center + 247);
      backCeil.rotation.set(PI_2, 0, -Math.PI);

      this.scene.add(frontCeil);
      this.scene.add(backCeil);
    });

    let sideCeilLoader = new THREE.TextureLoader();
    sideCeilLoader.load('assets/side_ceiling.jpg', (texture) => {

      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.needsUpdate = true;
      texture.repeat.set(10, 1);

      let material  = new THREE.MeshBasicMaterial({ map: texture }),
          geometry  = new THREE.PlaneGeometry(500, 6, 1, 10),
          leftCeil  = new THREE.Mesh(geometry, material),
          rightCeil = leftCeil.clone();

      leftCeil.position.set(-22, 50.9, this.center);
      leftCeil.rotation.set(PI_2, 0, -PI_2);

      rightCeil.position.set(22, 50.9, this.center);
      rightCeil.rotation.set(PI_2, 0, PI_2);

      this.scene.add(rightCeil);
      this.scene.add(leftCeil);
    });
  }

  createComputer() {
    this.loader.load('assets/test.json', (geometry, materials) => {
      materials[0].side = THREE.DoubleSide;

      let computer = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
      this.scene.add(computer);
    });
  }

  createTable() {
    this.loader.load('assets/table.json', (geometry, materials) => {
      const table = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      table.position.set(0, -19.8, -14.1);
      table.rotateY(Math.PI / 2);
      table.scale.set(6, 6, 6);

      this.scene.add(table);
    });
  }

  createDoor() {
    this.loader.load('assets/door.json', (geometry) => {
      let texture = new THREE.TextureLoader().load('assets/wood.jpg'),
          door    = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));

      door.position.set(0, 0, 500);
      door.scale.set(50, 50, 50);
      door.rotateY(Math.PI);

      this.scene.add(door);
    });
  }

  createEventHandlers() {
    window.addEventListener('resize', this.setResizeHandler.bind(this), false);
  }

  setResizeHandler() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.hole.appendChild(this.renderer.domElement);
    this.renderer.domElement.focus();
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
      front : this.center - 245,
      back  : this.center + 245,
      right :  20,
      left  : -20
    });
  }

  createMessage() {
    const isFullSize = window.outerWidth  === screen.availWidth &&
                       window.outerHeight === screen.availHeight;

    if (isFullSize) {
      // setTimeout(this.createCinematicIntro.bind(this), 100);
    } else {
      // Screen Message:
      // Before continuing, please maximize your browser window.
    }
  }

  createCinematicIntro() {
    this.clock = new THREE.Clock();
    this.elapsedSpeed = 4.5;

    setTimeout(() => {
      this.intro = true;
    }, 1000);
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

    if (this.camera.fov === 50) {
      this.intro = false;
    }

    this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
    this.renderer.setScissor(0, 0, this.WIDTH, this.HEIGHT);
    this.camera.updateProjectionMatrix();
  }

  getCameraFov() {
    this.elapsedSpeed += 0.05;

    let elapsedTime = this.clock.getElapsedTime(),
        zoomSpeed   = elapsedTime * this.elapsedSpeed,
        cameraFov   = zoomSpeed + 25;

    return (cameraFov < 50) ? cameraFov : 50;
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
