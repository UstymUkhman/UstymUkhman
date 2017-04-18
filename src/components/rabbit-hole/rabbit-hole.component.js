import * as THREE from 'three';
import { Component, ElementRef } from '@angular/core';

// const OrbitControls = require('three-orbit-controls')(THREE);


@Component({
  template: '',
  selector: 'rabbit-hole'
})


export class RabbitHoleComponent {
  constructor(rabbitHole) {
    this.scene      = null;
    this.camera     = null;
    this.renderer   = null;

    this.directionX = null;
    this.directionY = null;

    this.WHITE      = 0xFFFFFF;
    this.LIGHTGRAY  = 0xDDDDDD;
    this.DARKGRAY   = 0x333333;
    this.BLACK      = 0x000000;

    this.halfPI     = Math.PI / 2;
    this.WIDTH      = window.innerWidth;
    this.HEIGHT     = window.innerHeight;
    this.hole       = rabbitHole.nativeElement;

    this.createScene();
    this.createLight();
    this.createCamera();
    this.createRenderer();

    this.createInputListener();
    this.createEventHandlers();

    // this.createComputer();
    this.createFloor();
    this.createWalls();
    this.createSky();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 1, 10000);
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 50, 550);
    this.scene.add(this.camera);
  }

  createLight() {
    this.scene.add(new THREE.AmbientLight(this.DARKGRAY));
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.renderer.domElement.focus();
    this.hole.appendChild(this.renderer.domElement);
  }

  createInputListener() {
    // new OrbitControls(this.camera, this.renderer.domElement);

    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 38:
          if (this.checkCameraAngle(true))
            this.camera.rotateX(0.05);
        break;

        case 37:
          this.camera.rotateY(0.05);
        break;

        case 39:
          this.camera.rotateY(-0.05);
        break;

        case 40:
          if (this.checkCameraAngle(false))
            this.camera.rotateX(-0.05);
        break;

        case 87:
          this.camera.translateZ(-10);
        break;

        case 65:
          this.camera.translateX(-10);
        break;

        case 68:
          this.camera.translateX(10);
        break;

        case 83:
          this.camera.translateZ(10);
        break;
      }

      this.camera.position.y = 50;

      if (this.camera.position.x < -45)
        this.camera.position.x = -45;

      else if (this.camera.position.x > 45)
        this.camera.position.x = 45;
    });
  }

  createEventHandlers() {
    this.hole.addEventListener('mousemove', this.setCameraHandler.bind(this), false);
    window.addEventListener('resize', this.setResizeHandler.bind(this), false);
  }

  checkCameraAngle(top) {
    if (this.camera.rotation.x < -this.halfPI ||
        this.camera.rotation.x >  this.halfPI) {

      return top ? (this.camera.rotation.x < 0 || this.camera.rotation.x >= (Math.PI - 0.5))
                 : (this.camera.rotation.x > 0 || this.camera.rotation.x < (-Math.PI + 1.5));

    } else if (this.camera.rotation.x > -this.halfPI ||
               this.camera.rotation.x <  this.halfPI) {

      return top ? this.camera.rotation.x < 0.5
                 : this.camera.rotation.x > -1.5;
    }
  }

  setCameraHandler(event) {
    this.directionX = (event.offsetX - this.WIDTH  / 2) / 15000;
    this.directionY = (event.offsetY - this.HEIGHT / 2) / 15000;
  }

  setResizeHandler() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  /*checkRoomBorders() {
    this.camera.position.y = 50;

    if (this.camera.position.x < -45)
      this.camera.position.x = -45;

    else if (this.camera.position.x > 45)
      this.camera.position.x = 45;
  }

  createComputer() {
    const jsonLoader = new THREE.JSONLoader();

    jsonLoader.load('assets/Dell4550.json', (geometry) => {
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
  }*/

  createFloor() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/floor.jpg', (texture) => {

      let floorTexture   = texture;
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(1, 10);

      let floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide }),
          floorGeom     = new THREE.PlaneGeometry(100, 1000, 1, 10),
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
          vertWallGeom = new THREE.PlaneGeometry(1000, 150, 1, 10),
          horzWallGeom = new THREE.PlaneGeometry(1000, 100, 10, 10),

          wall1        = new THREE.Mesh(vertWallGeom, wallMaterial),
          wall2        = new THREE.Mesh(vertWallGeom, wallMaterial),
          wall3        = new THREE.Mesh(horzWallGeom, wallMaterial);

      wall1.rotation.y = this.halfPI;
      wall1.rotation.x = Math.PI;
      wall1.position.x = 50;
      wall1.position.y = 75;

      wall2.rotation.y = this.halfPI;
      wall2.rotation.x = Math.PI;
      wall2.position.x = -50;
      wall2.position.y = 75;

      wall3.rotation.z = -this.halfPI;
      wall3.rotation.x = this.halfPI;
      wall3.position.y = 150;
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

    let validDistance = Math.abs(this.directionX) > 0.01 || Math.abs(this.directionY) > 0.01,
        validAngle = this.checkCameraAngle(this.directionY < 0);

    if (validAngle && validDistance) {
      this.camera.rotateX(-this.directionY);
      this.camera.rotateY(-this.directionX);
    }
  }

  ngOnDestroy() {
    this.hole.removeEventListener('mousemove', this.setCameraHandler.bind(this));
    window.removeEventListener('resize', this.setResizeHandler.bind(this));
    cancelAnimationFrame(this.frame);
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
