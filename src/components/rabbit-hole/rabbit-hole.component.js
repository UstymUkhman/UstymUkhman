import * as THREE from 'three';
import { Component, ElementRef } from '@angular/core';

const OrbitControls = require('three-orbit-controls')(THREE);


@Component({
  template: '',
  selector: 'rabbit-hole'
})


export class RabbitHoleComponent {
  constructor(rabbitHole) {
    this.scene    = null;
    this.camera   = null;
    this.renderer = null;

    this.WHITE    = 0xffffff;
    this.GRAY     = 0x333333;
    this.BLACK    = 0x000000;

    this.WIDTH    = window.innerWidth;
    this.HEIGHT   = window.innerHeight;
    this.hole     = rabbitHole.nativeElement;

    this.createScene();
    this.createLight();
    this.createCamera();
    this.createRenderer();

    this.createInputListener();
    this.createResizeHandler();

    this.createFloor();
    this.createWalls();
    this.createSky();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 0.1, 20000);
    this.camera.position.set(0, 30, 550);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
  }

  createLight() {
    this.scene.add(new THREE.AmbientLight(this.GRAY));
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.renderer.domElement.focus();
    this.hole.appendChild(this.renderer.domElement);
  }

  createInputListener() {
    new OrbitControls(this.camera, this.renderer.domElement);

    document.addEventListener('keydown', (event) => {
      const code = event.keyCode;

      switch (event.keyCode) {
        case 87:
          this.camera.position.z -= 5;
        break;

        case 65:
          this.camera.rotateY(0.025);
        break;

        case 68:
          this.camera.rotateY(-0.025);
        break;

        case 83:
          this.camera.position.z += 5;
        break;
      }
    });
  }

  createResizeHandler() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/floor.jpg', (texture) => {

      let floorTexture   = texture;
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(10, 10);

      let floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide }),
          floorGeom     = new THREE.PlaneGeometry(1000, 1000, 10, 10),
          floor         = new THREE.Mesh(floorGeom, floorMaterial);

      floor.rotation.x = Math.PI / 2;
      floor.position.y = 0;
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
          vertWallGeom = new THREE.PlaneGeometry(1000, 170, 10, 10),
          horzWallGeom = new THREE.PlaneGeometry(1000, 300, 10, 10),

          wall1        = new THREE.Mesh(vertWallGeom, wallMaterial),
          wall2        = new THREE.Mesh(vertWallGeom, wallMaterial),
          wall3        = new THREE.Mesh(horzWallGeom, wallMaterial);

      wall1.rotation.y = Math.PI / 2;
      wall1.rotation.x = Math.PI;
      wall1.position.x = 150;
      wall1.position.y = 85;

      wall2.rotation.y = Math.PI / 2;
      wall2.rotation.x = Math.PI;
      wall2.position.x = -150;
      wall2.position.y = 85;

      wall3.rotation.z = -(Math.PI / 2);
      wall3.rotation.x = Math.PI / 2;
      wall3.position.y = 170;
      wall3.position.x = 0;

      this.scene.add(wall1);
      this.scene.add(wall2);
      this.scene.add(wall3);
    });
  }

  createSky() {
    let skyMaterial = new THREE.MeshBasicMaterial({ color: 0x168BDE, side: THREE.BackSide }),
        skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000),
        sky         = new THREE.Mesh(skyGeometry, skyMaterial);

    this.scene.fog = new THREE.FogExp2(0xC2C2C2, 0.0002);
    this.scene.add(sky);
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    cancelAnimationFrame(this.frame);
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
