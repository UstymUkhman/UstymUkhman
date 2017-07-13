import * as THREE                from 'three';
import { Component, ElementRef } from '@angular/core';
import { ControlsService       } from '../../services/controls.service';
import { LetteringService      } from '../../services/lettering.service';

let OrbitControls = require('three-orbit-controls')(THREE);


@Component({
  selector: 'rabbit-hole',
  templateUrl: 'components/rabbit-hole/rabbit-hole.component.html'
})


export class RabbitHoleComponent {
  constructor(rabbitHole, cameraControls, lettering) {
    this.scene       = null;
    this.camera      = null;
    this.renderer    = null;
    this.intro       = false;
    this.pressed     = false;

    this.WHITE       = 0xFFFFFF;
    this.LIGHTGRAY   = 0xDDDDDD;
    this.DARKGREEN   = 0x406550;
    this.DARKGRAY    = 0x333333;
    this.BLACK       = 0x000000;

    this.hole        = rabbitHole.nativeElement;
    this.loader      = new THREE.JSONLoader();
    this.controls    = cameraControls;
    this.lettering   = lettering;
    this.showOverlay = false;
    this.introPlayed = false;
    this.guidelines  = null;
    this.center      = 225;

    this.createScene();
    this.createCamera();
    this.createLight();

    this.createFloor();
    this.createWalls();
    this.createCeiling();

    this.createComputer();
    this.createTable();
    this.createDoors();

    this.createRenderer();
    this.setResizeHandler();
    this.createMessage();

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.createControls();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(7, this.WIDTH / this.HEIGHT, 1, 1000);
    this.camera.rotation.x = -Math.PI / 4.465;
    this.camera.position.z = -5;
    // this.camera.position.z = 300;

    this.scene.add(this.camera);
  }

  createLight() {
    const ambientLight = new THREE.AmbientLight(this.WHITE, 0.25)
    const firstLight = new THREE.SpotLight(this.WHITE);

    firstLight.target.position.set(0, 0, this.center);
    firstLight.target.updateMatrixWorld();
    firstLight.position.set(0, 300, -75);
    firstLight.distance = 750;

    const secondLight = firstLight.clone();
    secondLight.position.z = 525;

    this.scene.add(firstLight);
    this.scene.add(secondLight);
    this.scene.add(ambientLight);
  }

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/textures/floor.jpg', (texture) => {

      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.needsUpdate = true;

      let floorMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0,
        opacity: 1,

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
    textureLoader.load('assets/textures/wall.png', (emptyWall) => {
      textureLoader.load('assets/textures/wall.jpg', (fullWall) => {

        const PI_2 = Math.PI / 2;

        emptyWall.wrapS = emptyWall.wrapT = THREE.MirroredRepeatWrapping;
        fullWall.wrapS = fullWall.wrapT = THREE.MirroredRepeatWrapping;

        emptyWall.needsUpdate = true;
        fullWall.needsUpdate = true;

        emptyWall.repeat.set(1, 1);
        fullWall.repeat.set(1, 1);

        const geometry     = new THREE.PlaneGeometry( 50, 65, 1, 10),
              fullMaterial = new THREE.MeshBasicMaterial({ map: fullWall }),

              emptyMaterial = new THREE.MeshBasicMaterial({
                alphaMap: emptyWall,
                transparent: true,
                map: emptyWall,
                opacity: 10,
              });

        const backWall  = new THREE.Mesh(geometry, emptyMaterial),
              frontWall = new THREE.Mesh(geometry, fullMaterial);

        frontWall.position.set(0, 18.5, this.center - 250);
        backWall.position.set(0, 18.5, this.center + 250);
        backWall.rotateY(Math.PI);

        this.scene.add(frontWall);
        this.scene.add(backWall);

        for (let i = 0; i < 20; i++) {
          const material = (i % 4 > 1) ? emptyMaterial : fullMaterial,
                wall     = new THREE.Mesh(geometry, material);

          let positionZ = i * 25,
              rotationY = PI_2,
              positionX = -25;

          if (i % 2) {
            positionX = 25;
            rotationY = -PI_2;
            positionZ = (i - 1) * 25;
          }

          wall.position.set(positionX, 18.5, positionZ);
          wall.rotateY(rotationY);
          this.scene.add(wall);
        }
      });
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
    frontCeilLoader.load('assets/textures/front_ceiling.jpg', (texture) => {

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
    sideCeilLoader.load('assets/textures/side_ceiling.jpg', (texture) => {

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
    this.loader.load('assets/models/case.json', (geometry, materials) => {
      const systemUnit = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      systemUnit.position.set(-1, 0, -19);
      systemUnit.scale.set(0.8, 0.8, 0.8);
      this.scene.add(systemUnit);
    });

    this.loader.load('assets/models/keyboard.json', (geometry, materials) => {
      const keyboard = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      keyboard.position.set(0, 0, -16.5);
      keyboard.scale.set(0.8, 0.8, 0.8);
      this.scene.add(keyboard);
    });

    this.loader.load('assets/models/monitor.json', (geometry, materials) => {
      const monitor = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      monitor.position.set(0, 0, -16.5);
      monitor.rotation.set(-0.05, 0, 0);
      monitor.scale.set(0.8, 0.8, 0.8);
      this.scene.add(monitor);
    });
  }

  createTable() {
    this.loader.load('assets/models/table.json', (geometry) => {
      const material = new THREE.MeshStandardMaterial({
        shading: THREE.SmoothShading,
        transparent: false,
        color: 0xBDBDBD,
        metalness: 0.1,
        roughness: 1,
        opacity: 1
      });

      const table = new THREE.Mesh(geometry, material);

      table.position.set(0, -19.8, -14.1);
      table.rotateY(Math.PI / 2);
      table.scale.set(6, 6, 6);
      this.scene.add(table);
    });
  }

  createDoors() {
    this.loader.load('assets/models/frame.json', (frameGeometry, frameMaterials) => {
      this.loader.load('assets/models/door.json', (doorGeometry, doorMaterials) => {
        frameMaterials[0].color = new THREE.Color(0x496F61);
        frameMaterials[1].color = new THREE.Color(0x496F61);

        const frontFrame = new THREE.Mesh(frameGeometry, new THREE.MultiMaterial(frameMaterials));
        const PI_2 = Math.PI / 2;

        doorMaterials[0].color = new THREE.Color(0xEEEEEE);
        doorMaterials[1].color = new THREE.Color(0x496F61);

        this.frontDoor = new THREE.Mesh(doorGeometry, new THREE.MultiMaterial(doorMaterials));

        frontFrame.position.set(0, -10.5, 475);
        frontFrame.rotation.y = Math.PI;

        this.frontDoor.position.set(8.75, 0, 0);
        this.frontDoor.rotation.y = Math.PI;

        this.frontDoor.scale.set(4, 4, 4);
        frontFrame.scale.set(4, 4, 4);

        this.scene.add(this.frontDoor);
        this.scene.add(frontFrame);

        const pitch = new THREE.Object3D();
        this.pivot = new THREE.Object3D();

        this.pivot.position.set(-8.75, -10.4, 474.75);
        this.pivot.rotation.y = 0;

        this.pivot.add(this.frontDoor);
        this.scene.add(pitch);
        pitch.add(this.pivot);

        for (let i = 0; i < 10; i++) {
          const sideFrame = frontFrame.clone(),
                sideDoor  = this.frontDoor.clone();

          let positionZ = i * 50 + 50,
              doorPositionX = -24.8,
              framePositionX = -25,
              rotationY = PI_2;

          if (i % 2) {
            framePositionX = -framePositionX;
            doorPositionX = -doorPositionX;
            positionZ = (i - 1) * 50 + 50;
            rotationY = -rotationY;
          }

          sideFrame.position.set(framePositionX, -10.5, positionZ);
          sideDoor.position.set(doorPositionX, -10.4, positionZ);

          sideFrame.rotation.y = rotationY;
          sideDoor.rotation.y = rotationY;

          this.scene.add(sideFrame);
          this.scene.add(sideDoor);
        }
      });
    });
  }

  createEventHandlers() {
    document.addEventListener('keydown', this.setKeyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.setKeyUpHandler.bind(this), false);
    window.addEventListener('resize', this.setResizeHandler.bind(this), false);
  }

  setKeyDownHandler(event) {
    if (this.intro) return;

    const ready = this.isFullSize && event.keyCode === 13;
    this.pressed = (event.keyCode === 32);

    if (ready) {
      this.controls.setGameMode();
    }

    if (ready && !this.introPlayed) {
      this.showOverlay = true;
      setTimeout(this.createCinematicIntro.bind(this), 2500);
    }
  }

  setKeyUpHandler(event) {
    this.pressed = false;
  }

  setResizeHandler() {
    const minWidth  = screen.availWidth  - 16,
          minHeight = screen.availHeight - 16;

    this.WIDTH      = window.innerWidth;
    this.HEIGHT     = window.innerHeight;

    if (!this.isFullSize) {
      this.isFullSize = window.outerWidth  >= minWidth &&
                        window.outerHeight >= minHeight;
    }

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  setErrorHandler() {
    console.error('Your shitty browser does not support Pointer Lock API.\nYou need to update it or use a better one: https://www.google.it/chrome/browser/desktop/');
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
    const error = this.controls.init(this.renderer.domElement, this.scene, this.camera);

    if (error) {
      this.setErrorHandler();
    }

    this.controls.setBorders({
      front : this.center - 230,
      back  : this.center + 242,
      right :  18,
      left  : -18
    });
  }

  createMessage() {
    this.guidelines = `
      Welcome to the real world.###
      Use [W], [A], [S], [D] keys to move and drag you mouse to look around.##
      Use [SPACE] to interact with the enviroment.#####
    `;

    if (!this.isFullSize) {
      this.guidelines += `
        It seems that your browser window is not full size.##
        Please, be sure to maximize it in order to fully enjoy this experience.#####
      `;
    }

    this.guidelines += 'Press [ENTER] when you\'re ready.';
  }

  createCinematicIntro() {
    this.clock = new THREE.Clock();
    this.elapsedSpeed = 4.0;

    setTimeout(() => { this.intro = true; }, 1000);
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (this.intro) {
      this.animateCameraIntro();
    }

    if (this.pivot) {
      this.openTheDoor();
    }
  }

  animateCameraIntro() {
    this.camera.fov = this.getCameraFov();

    if (this.camera.fov === 50) {
      this.controls.enable();
      this.introPlayed = true;
      this.intro = false;
    }

    this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
    this.renderer.setScissor(0, 0, this.WIDTH, this.HEIGHT);
    this.camera.updateProjectionMatrix();
  }

  openTheDoor() {
    if (this.pressed && this.pivot.rotation.y < 1.56) {
      this.pivot.rotation.y += 0.01;

    } else if (!this.pressed && this.pivot.rotation.y > 1) {
      this.pivot.rotation.y += 0.01;

    } else if (!this.pressed && this.pivot.rotation.y > 0) {
      this.pivot.rotation.y -= 0.02;
    }

    if (this.pivot.rotation.y > 1.56) {
      this.pivot.rotation.y = 1.56;
    }

    if (this.pivot.rotation.y < 0) {
      this.pivot.rotation.y = 0;
    }
  }

  getCameraFov() {
    this.elapsedSpeed += this.camera.fov < 20 ? 0.01 : 0.06;

    const elapsedTime = this.clock.getElapsedTime(),
          zoomSpeed   = elapsedTime * this.elapsedSpeed,
          cameraFov   = zoomSpeed + 7;

    return (cameraFov < 50) ? cameraFov : 50;
  }

  ngAfterViewInit() {
    this.lettering.animate(
      this.hole.children[1].children[1].children[0],
      50, this.createEventHandlers.bind(this), null
    );
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.setKeyDownHandler.bind(this), false);
    document.removeEventListener('keyup', this.setKeyUpHandler.bind(this), false);
    window.removeEventListener('resize', this.setResizeHandler.bind(this), false);

    cancelAnimationFrame(this.frame);
    this.controls.dispose();
  }

  static get parameters() {
    return [[ElementRef], [ControlsService], [LetteringService]];
  }
}
