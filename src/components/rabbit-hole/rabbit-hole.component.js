import * as THREE                from 'three';
import { Component, ElementRef } from '@angular/core';
import { Http                  } from '@angular/http';

import { SoundsService         } from '../../services/sounds.service';
import { LoadingService        } from '../../services/loading.service';
import { ControlsService       } from '../../services/controls.service';
import { LetteringService      } from '../../services/lettering.service';


@Component({
  selector: 'rabbit-hole',
  templateUrl: 'components/rabbit-hole/rabbit-hole.component.html'
})


export class RabbitHoleComponent {
  constructor(http, rabbitHole, sounds, loading, cameraControls, lettering) {

    this.introStarted = false;
    this.activeButton = false;
    this.showOverlay  = false;
    this.introPlayed  = false;
    this.experiment   = false;
    this.rightDoor    = false;
    this.pressed      = false;
    this.intro        = false;
    this.exit         = false;
    this.ready        = false;
    this.hasKey       = false;
    this.canTake      = false;
    this.canOpen      = false;
    this.fadeOut      = false;
    this.showScreen   = true;

    this.selectedDoor = null;
    this.guidelines   = null;
    this.rightLight   = null;
    this.leftLight    = null;
    this.backLight    = null;
    this.renderer     = null;
    this.camera       = null;
    this.scene        = null;
    this.key          = null;

    this.WHITE     = 0xFFFFFF;
    this.LIGHTGRAY = 0xEEEEEE;
    this.GREEN     = 0x496F61;
    this.DARKGREEN = 0x406550;
    this.BLACK     = 0x000000;

    this.loader    = new THREE.JSONLoader();
    this.raycaster = new THREE.Raycaster();
    this.focus     = new THREE.Vector2();

    this.hole        = rabbitHole.nativeElement;
    this.controls    = cameraControls;
    this.lettering   = lettering;
    this.loading     = loading;
    this.sounds      = sounds;
    this.http        = http;
    this.experiments = [];
    this.doors       = [];
    this.suggestion  = '';

    this.center        = 225;
    this.raycaster.far = 15;
    this.focus.x       = 0;
    this.focus.y       = 2;

    this.createScene();
    this.createCamera();
    this.createLight();

    this.createFloor();
    this.createWalls();
    this.createCeiling();
    this.createDoors();

    this.createTable();
    this.createComputer();
    this.createKey();

    this.createRenderer();
    this.setResizeHandler();
    this.createMessage();

    this.createControls();
    this.getExperiments();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(7, this.WIDTH / this.HEIGHT, 1, 1000);
    this.camera.rotation.x = -Math.PI / 4.465;
    this.camera.position.z = -5;
    this.scene.add(this.camera);
  }

  createLight() {
    const ambientLight = new THREE.AmbientLight(this.WHITE, 0.25)
    const firstLight   = new THREE.SpotLight(this.WHITE);

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
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/textures/floor.jpg', (texture) => {

      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.needsUpdate = true;

      const floorMaterial = new THREE.MeshStandardMaterial({
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

        const lightGeometry = new THREE.PlaneGeometry(510, 75, 1, 1),
              lightMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                color: this.WHITE,
                opacity: 0
              });

        this.leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
        this.leftLight.position.set(-25.5, 18.5, this.center);
        this.leftLight.rotateY(PI_2);

        this.rightLight = this.leftLight.clone();
        this.rightLight.rotation.y = -PI_2;
        this.rightLight.position.x = 25.5;

        this.scene.add(this.rightLight);
        this.scene.add(this.leftLight);

        emptyWall.wrapS = emptyWall.wrapT = THREE.MirroredRepeatWrapping;
        fullWall.wrapS = fullWall.wrapT = THREE.MirroredRepeatWrapping;

        emptyWall.needsUpdate = true;
        fullWall.needsUpdate = true;

        emptyWall.repeat.set(1, 1);
        fullWall.repeat.set(1, 1);

        const geometry      = new THREE.PlaneGeometry(50, 65, 1, 1),
              fullMaterial  = new THREE.MeshBasicMaterial({ map: fullWall }),
              emptyMaterial = new THREE.MeshBasicMaterial({
                alphaMap: emptyWall,
                transparent: true,
                map: emptyWall,
                opacity: 10
              });

        const backWall  = new THREE.Mesh(geometry, emptyMaterial),
              frontWall = new THREE.Mesh(geometry, fullMaterial);

        frontWall.position.set(0, 18.5, this.center - 250);
        backWall.position.set(0, 18.5, this.center + 250);
        backWall.rotateY(Math.PI);

        this.backLight = backWall.clone();

        this.backLight.geometry = new THREE.PlaneGeometry(50, 75, 1, 1),
        this.backLight.material = lightMaterial;
        this.backLight.position.z += 0.5;

        this.scene.add(this.backLight);
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

  createComputer() {
    this.loader.load('assets/models/case.json', (geometry, materials) => {
      const systemUnit = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      systemUnit.position.set(-1, 0, -19);
      systemUnit.scale.set(0.8, 0.8, 0.8);
      this.scene.add(systemUnit);
    });

    this.loader.load('assets/models/keyboard.json', (geometry, materials) => {
      this.keyboard = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      this.keyboard.position.set(0, 0, -16.5);
      this.keyboard.scale.set(0.8, 0.8, 0.8);
      this.scene.add(this.keyboard);
    });

    this.loader.load('assets/models/monitor.json', (geometry, materials) => {
      const monitor = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

      monitor.position.set(0, 0, -16.5);
      monitor.rotation.set(-0.05, 0, 0);
      monitor.scale.set(0.8, 0.8, 0.8);
      this.scene.add(monitor);
    });
  }

  createKey() {
    this.loader.load('assets/models/key.json', (geometry, materials) => {
      this.key = new THREE.Mesh(geometry, materials[0]);

      this.key.rotation.set(0, -0.5, -Math.PI / 2);
      this.key.position.set(4, -2.4, -14);
      this.key.scale.set(3, 3, 3);

      this.scene.add(this.key);
    });
  }

  createDoors() {
    this.loader.load('assets/models/frame.json', (frameGeometry, frameMaterials) => {
      this.loader.load('assets/models/door.json', (doorGeometry, doorMaterials) => {
        frameMaterials[0].color = new THREE.Color(this.GREEN);
        frameMaterials[1].color = new THREE.Color(this.GREEN);

        doorMaterials[0].color = new THREE.Color(this.LIGHTGRAY);
        doorMaterials[1].color = new THREE.Color(this.GREEN);

        const frontFrame = new THREE.Mesh(frameGeometry, new THREE.MultiMaterial(frameMaterials)),
              frontDoor  = new THREE.Mesh(doorGeometry, new THREE.MultiMaterial(doorMaterials)),
              OFFSET     = 8.75;

        frontFrame.position.set(0, -10.5, 475);
        frontFrame.rotation.y = Math.PI;
        frontFrame.scale.set(4, 4, 4);

        frontDoor.position.set(OFFSET, 0, 0);
        frontDoor.rotation.y = Math.PI;
        frontDoor.scale.set(4, 4, 4);

        this.scene.add(frontFrame);
        this.scene.add(frontDoor);

        const pitch = new THREE.Object3D(),
              pivot = new THREE.Object3D(),
              PI_2  = Math.PI / 2;

        pivot.position.set(-OFFSET, -10.4, 474.75);
        pivot.rotation.y = 0;

        pivot.add(frontDoor);
        pitch.add(pivot);

        this.scene.add(pitch);
        this.doors.push({
          door: frontDoor,
          pivot: pivot
        });

        for (let i = 0; i < 10; i++) {
          const sideFrame = frontFrame.clone(),
                sideDoor  = frontDoor.clone(),

                pitch = new THREE.Object3D(),
                pivot = new THREE.Object3D();

          let framePositionX = -25,
              rotationY      = PI_2,
              doorPositionX  = -24.8,
              rotation       = OFFSET,
              positionZ      = i * 50 + 50,
              pivotRotation  = positionZ - OFFSET;

          if (i % 2) {
            rotation       = -OFFSET;
            rotationY      = -rotationY;
            doorPositionX  = -doorPositionX;
            framePositionX = -framePositionX;
            positionZ      = (i - 1) * 50 + 50;
            pivotRotation  = positionZ + OFFSET;
          }

          sideFrame.position.set(framePositionX, -10.5, positionZ);
          sideDoor.position.set(0, 0, rotation);

          sideFrame.rotation.y = rotationY;
          sideDoor.rotation.y = rotationY;
          sideDoor.index = i;

          pivot.position.set(doorPositionX, -10.4, pivotRotation);
          pivot.rotation.y = 0;

          this.scene.add(sideFrame);
          this.scene.add(sideDoor);
          this.scene.add(pitch);

          pivot.add(sideDoor);
          pitch.add(pivot);

          this.doors.push({
            door: sideDoor,
            pivot: pivot
          });
        }
      });
    });
  }

  setMouseDownHandler(event) {
    if (event.which !== 1) return;
    this.pressed = this.controls.isFullscreen();

    if (this.introPlayed && !this.hasKey && this.canTake) {
      this.key.visible = false;
      this.canTake = false;
      this.hasKey = true;
    }
  }

  setMouseUpHandler() {
    this.pressed = false;
  }

  setKeyDownHandler(event) {
    const ready = this.isFullSize && event.keyCode === 13;
    const inFullscreen = this.controls.isFullscreen();

    if (this.introStarted) return;

    if (ready && !this.frame) {
      this.frame = requestAnimationFrame(this.animate.bind(this));
    }

    if (ready && inFullscreen) {
      if (this.introPlayed) {
        this.controls.enable();
      }

      this.controls.setFullscreenMode(false);
      this.exitFullscreenMode();
    }

    if (ready && !inFullscreen) {
      if (this.introPlayed) {
        this.controls.enable(false);
      }

      this.controls.setFullscreenMode(true);
      this.enterFullscreenMode();
    }

    if (ready && !this.introPlayed) {
      const delay = this.activeButton ? 0 : 2500;

      this.introStarted = true;
      this.lettering.skipLettering();
      this.controls.setFullscreenMode();

      setTimeout(() => {
        this.showOverlay = true;
      }, delay);

      setTimeout(() => {
        this.showScreen = false;
        this.createCinematicIntro();
      }, delay + 2500);
    }
  }

  enterFullscreenMode() {
    document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mouseup', this.onMouseUp, false);

    this.forceSuggestion = false;
    this.ready = true;
  }

  exitFullscreenMode() {
    document.removeEventListener('mousedown', this.onMouseDown, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);

    this.suggestion = 'Press enter to interact';
    this.forceSuggestion = true;
    this.ready = false;
  }

  createCinematicIntro() {
    setTimeout(() => { this.intro = true; }, 1000);
    this.clock = new THREE.Clock();
    this.elapsedSpeed = 4.0;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.hole.appendChild(this.renderer.domElement);
    this.renderer.domElement.focus();
  }

  setBlurHandler() {
    this.controls.setFullscreenMode(false);
    this.exitFullscreenMode();
  }

  setResizeHandler() {
    const minWidth  = screen.availWidth  - 16,
          minHeight = screen.availHeight - 16;

    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    if (!this.isFullSize) {
      this.isFullSize = window.outerWidth  >= minWidth &&
                        window.outerHeight >= minHeight;
    }

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  createMessage() {
    this.guidelines = `
      Welcome to the real world.###
      Use W, A, S, D keys to move and drag you mouse to look around.##
      Press left mouse button to interact with the enviroment.#####
    `;

    if (!this.isFullSize) {
      this.guidelines += `
        It seems that your browser window is not full size.##
        Please, be sure to maximize it in order to fully enjoy this experience.#####
      `;
    }

    this.forceSuggestion = false;
    this.guidelines += 'Press  ENTER  when you\'re ready.';
    this.suggestion  = 'Hold left mouse button to open the door';
  }

  createControls() {
    const error = this.controls.init(this.renderer.domElement, this.scene, this.camera);

    if (error) {
      console.error(
        'Your shitty browser does not support Pointer Lock API.',
        'You need to update it or use a better one: https://www.google.it/chrome/browser/desktop/'
      );
    }

    this.controls.outFullscreenCallback(() => {
      this.controls.enable(false);
      this.exitFullscreenMode();
    });

    this.controls.setBorders({
      front : this.center - 230,
      back  : this.center + 242,
      right :  18,
      left  : -18
    });
  }

  getExperiments() {
    this.http.get('assets/experiments.json').subscribe(
      res   => this.experiments = res.json().experiments,
      error => console.error(error)
    );
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);

    if (this.intro) {
      this.animateCameraIntro();
    } else {
      this.checkFocusDirection();
    }

    if (this.controls && this.introPlayed) {
      this.controls.update();
    }

    if (this.exit) {
      if (this.fadeOut) {
        cancelAnimationFrame(this.frame);
        setTimeout(this.gotoNextPage.bind(this), 1500);
      }

      this.lightFadeIn();
    }
  }

  animateCameraIntro() {
    this.camera.fov = this.getCameraFov();

    if (this.camera.fov === 50) {
      this.introStarted = false;
      this.introPlayed = true;
      this.intro = false;

      if (this.controls.isFullscreen()) {
        this.controls.enable();
      }
    }

    this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
    this.renderer.setScissor(0, 0, this.WIDTH, this.HEIGHT);
    this.camera.updateProjectionMatrix();
  }

  getCameraFov() {
    this.elapsedSpeed += this.camera.fov < 20 ? 0.01 : 0.06;

    const elapsedTime = this.clock.getElapsedTime(),
          zoomSpeed   = elapsedTime * this.elapsedSpeed,
          cameraFov   = zoomSpeed + 7;

    return (cameraFov < 50) ? cameraFov : 50;
  }

  checkFocusDirection() {
    const direction = this.controls.getCameraDirection();

    this.canOpen = false;
    this.raycaster.setFromCamera(this.focus, this.camera);
    this.raycaster.ray.direction.copy(direction).applyEuler(this.camera.rotation);

    if (this.keyboard && this.key && !this.hasKey) {
      this.canTake = !!this.raycaster.intersectObjects([this.keyboard, this.key]).length;

      if (this.canTake) {
        this.suggestion = this.ready ? 'Take the key' : 'Press enter to interact';
      }
    }

    const doors      = Array.from(this.doors, doors => doors.door);
    const intersects = this.raycaster.intersectObjects(doors);

    if (intersects.length) {
      if (this.pressed && !this.hasKey) {
        this.sounds.closedDoor();

      } else if (this.hasKey) {
        const selectedDoor = intersects[0].object;

        const door = this.doors.filter((mesh) => {
          return mesh.door.id === selectedDoor.id;
        });

        this.suggestion = this.ready ? 'Hold left mouse button to open the door' : 'Press enter to interact';
        this.canOpen = true;
        this.openTheDoor(door[0]);
      }

    } else if (this.selectedDoor) {
      this.openTheDoor();
    }
  }

  openTheDoor(door = this.selectedDoor) {
    if (!this.selectedDoor) {
      this.selectedDoor = door;
    }

    if (this.pressed && door.pivot.rotation.y < 1.56) {
      if (!door.pivot.rotation.y) {
        if (this.playDoorSound(door.door.index)) return;
      }

      door.pivot.rotation.y += 0.01;

    } else if (!this.pressed && door.pivot.rotation.y > 1) {
      door.pivot.rotation.y += 0.01;

    } else if (!this.pressed && door.pivot.rotation.y > 0) {
      door.pivot.rotation.y -= 0.02;
    }

    if (door.pivot.rotation.y > 1.56) {
      door.pivot.rotation.y = 1.56;
      this.fadeOut = true;
    }

    if (door.pivot.rotation.y > 1) {
      this.rightDoor  = door.door.position.z < 0;
      this.experiment = !!door.door.position.z;

    } else if (door.pivot.rotation.y > 0.5) {
      this.canOpen = false;
      this.exit = true;
    }

    if (door.pivot.rotation.y <= 0) {
      this.rightLight.material.opacity = 0;
      this.leftLight.material.opacity  = 0;
      this.backLight.material.opacity  = 0;

      door.pivot.rotation.y = 0;
      this.selectedDoor = null;
      this.exit = false;
    }
  }

  playDoorSound(door) {
    const closed = door >= this.experiments.length;

    if (closed) {
      this.sounds.closedDoor();
    } else {
      this.sounds.openedDoor();
    }

    return closed;
  }

  gotoNextPage() {
    this.controls.enable(false);
    this.exitFullscreenMode();
    this.frame = null;

    if (this.experiment && this.selectedDoor) {
      const index = this.selectedDoor.door.index;
      const experiment = this.experiments[index];
      const url = experiment[Object.keys(experiment)[0]];

      this.exit = false;
      this.fadeOut = false;
      this.loading.loadExperiment(url);
      this.selectedDoor.pivot.rotation.y = 0;

    } else {
      this.removeEventHandlers();
      this.loading.backToMenu(true);
    }
  }

  lightFadeIn() {
    if (this.experiment) {
      const light = this.rightDoor ? this.rightLight : this.leftLight;
      light.material.opacity += 0.01;

    } else {
      this.backLight.material.opacity += 0.01;
    }
  }

  createEventHandlers() {
    this.onMouseDown = this.setMouseDownHandler.bind(this);
    this.onMouseUp   = this.setMouseUpHandler.bind(this);
    this.onKeyDown   = this.setKeyDownHandler.bind(this);

    this.onResize    = this.setResizeHandler.bind(this);
    this.onBlur      = this.setBlurHandler.bind(this);

    document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
    document.addEventListener('keydown', this.onKeyDown, false);

    window.addEventListener('resize', this.onResize, false);
    window.addEventListener('blur', this.onBlur, false);
  }

  removeEventHandlers() {
    document.removeEventListener('mousedown', this.onMouseDown, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
    document.removeEventListener('keydown', this.onKeyDown, false);

    window.removeEventListener('resize', this.onResize, false);
    window.removeEventListener('blur', this.onBlur, false);

    this.controls.dispose();
  }

  ngAfterViewInit() {
    this.createEventHandlers();
    this.lettering.animate(
      this.hole.children[1].children[1].children[0],
      50, () => { this.activeButton = true; }, 0
    );
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.removeEventHandlers();
    this.controls = null;
  }

  static get parameters() {
    return [
      [Http],
      [ElementRef],
      [SoundsService],
      [LoadingService],
      [ControlsService],
      [LetteringService]
    ];
  }
}
