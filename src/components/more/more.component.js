import { Component, ElementRef } from '@angular/core';
import * as THREE                from 'three';


@Component({
  selector: 'more',
  templateUrl: 'components/more/more.component.html'
})


export class MoreComponent {
  constructor(more) {
    this.scene    = null;
    this.light    = null;
    this.camera   = null;
    this.renderer = null;
    this.bluePill = null;
    this.redPill  = null;
    this.choice   = null;

    this.WHITE    = 0xFFFFFF;
    this.BLACK    = 0x000000;
    this.GRAY     = 0x444444;
    this.BLUE     = 0x003FFF;
    this.RED      = 0xB40000;

    this.showRed  = false;
    this.showBlue = false;
    this.more     = more.nativeElement;

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createRenderer();

    this.loadPill(this.BLUE);
    this.loadPill(this.RED);
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 7.5;
  }

  createLights() {
    this.scene.add(new THREE.AmbientLight(this.GRAY));

    let light = new THREE.DirectionalLight(this.WHITE, 0.5);
    light.position.set(25, 50, -50);
    light.castShadow = true;
    this.scene.add(light);

    light = new THREE.SpotLight(this.WHITE, 1, 100, 1, 0, 1);
    light.position.set(-25, 25, 5);
    this.scene.add(light);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.BLACK, 0);

    this.more.appendChild(this.renderer.domElement);
  }

  loadPill(color) {
    const jsonLoader = new THREE.JSONLoader();

    let pillMaterial = {
      shading           : THREE.SmoothShading,
      emissive          : this.BLACK,
      color             : color,
      emissiveIntensity : 1,

      roughness         : 0.2,
      metalness         : 0,
      opacity           : 0,

      depthTest         : true,
      depthWrite        : true,
      transparent       : true
    };

    jsonLoader.load('assets/pill.json', (geometry) => {
      let pill = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial(pillMaterial));

      if (color === this.BLUE) {
        pill.rotation.set(0, -1.5, -0.4);
        pill.position.set(2.5, 0, 2);
        this.bluePill = pill;

        setTimeout(() => {
          this.showBlue = true;
        }, 500);

      } else {
        pill.rotation.set(-0.05, 1.3, 0.4);
        pill.position.set(-2.5, 0.2, 2);
        this.redPill = pill;

        setTimeout(() => {
          this.showRed = true;
          setTimeout(this.createChoice.bind(this), 2000);
        }, 2500);
      }

      pill.scale.set(0.2, 0.2, 0.2);
      this.scene.add(pill);
    });
  }

  createChoice() {
    this.choice   = false;
    this.showRed  = false;
    this.showBlue = false;

    this.pillChoice = this.setChosenPill.bind(this);
    document.addEventListener('keydown', this.pillChoice, false);
    // document.removeEventListener('keydown', this.pillChoice, false);
  }

  setChosenPill(event) {
    const code = event.keyCode;

    if (code === 37 || code === 39) {
      this.choice = !this.choice;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);

    if (this.bluePill && this.redPill) {
      if (this.showBlue && this.bluePill.material.opacity < 0.9) {
        this.bluePill.material.opacity += 0.01;
      }

      if (this.showRed && this.redPill.material.opacity < 0.9) {
        this.redPill.material.opacity += 0.01;
      }

      if (this.choice === false && this.redPill.scale.x > 0.1) {
        this.redPill.scale.x           -= 0.005;
        this.redPill.scale.y           -= 0.005;
        this.redPill.scale.z           -= 0.005;
        this.redPill.material.opacity  -= 0.025;

        this.bluePill.scale.x          += 0.005;
        this.bluePill.scale.y          += 0.005;
        this.bluePill.scale.z          += 0.005;
        this.bluePill.material.opacity += 0.025;
      }

      if (this.choice === true && this.redPill.scale.x < 0.3) {
        this.redPill.scale.x           += 0.005;
        this.redPill.scale.y           += 0.005;
        this.redPill.scale.z           += 0.005;
        this.redPill.material.opacity  += 0.025;

        this.bluePill.scale.x          -= 0.005;
        this.bluePill.scale.y          -= 0.005;
        this.bluePill.scale.z          -= 0.005;
        this.bluePill.material.opacity -= 0.025;
      }
    }
  }

  static get parameters() {
    return [[ElementRef]];
  }
}
