import { Component, ElementRef } from '@angular/core';
import { ControlsService       } from '../../services/controls.service';


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

    this.error      = false;
    this.halfPI     = Math.PI / 2;
    this.WIDTH      = window.innerWidth;
    this.HEIGHT     = window.innerHeight;

    this.hole       = rabbitHole.nativeElement;
    this.controls   = cameraControls;

    this.createScene();
    this.createCamera();
    this.createLight();

    this.createSky();
    this.createFloor();
    this.createWalls();

    // this.createComputer();
    // this.createDoor();

    this.createEventHandlers();
    this.createRenderer();
    this.createControls();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.WIDTH / this.HEIGHT, 1, 1000);
    this.scene.add(this.camera);
  }

  createLight() {
    this.scene.add(new THREE.AmbientLight(this.DARKGRAY));
  }

  createControls() {
    this.error = this.controls.init(this.renderer.domElement, this.scene, this.camera);
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
          floorGeom     = new THREE.PlaneGeometry(100, 1000, 1, 10),
          floor         = new THREE.Mesh(floorGeom, floorMaterial);

      floor.rotation.x = Math.PI / 2;
      floor.position.y = 0;
      this.scene.add(floor);
    });
  }

  /*createFloor() {
    let geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i < geometry.vertices.length; i++) {
      let vertex = geometry.vertices[i];

      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;
    }

    for(let i = 0; i < geometry.faces.length; i++) {
      let face = geometry.faces[i];

      face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }

    let material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors }),
        floor    = new THREE.Mesh(geometry, material);

    this.scene.add(floor);
  }*/

  createWalls() {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/wall.jpg', (texture) => {

      let wallTexture   = texture;
      wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.repeat.set(5, 1);

      let wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.DoubleSide }),
          horzWallGeom = new THREE.PlaneGeometry(1000, 100, 10, 10),
          vertWallGeom = new THREE.PlaneGeometry(1000, 150, 1, 10),

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

  checkRoomBorders() {
    this.camera.position.y = 50;
    if (this.camera.position.x < -45)
      this.camera.position.x = -45;
    else if (this.camera.position.x > 45)
      this.camera.position.x = 45;
  }

  createEventHandlers() {
    window.addEventListener('resize', this.setResizeHandler.bind(this), false);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(this.BLACK, 0);

    this.renderer.domElement.focus();
    this.hole.appendChild(this.renderer.domElement);
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setResizeHandler.bind(this));
    cancelAnimationFrame(this.frame);
    this.controls.remove();
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
