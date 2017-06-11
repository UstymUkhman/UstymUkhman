import {
  Mesh                  ,
  Scene                 ,
  SpotLight             ,
  JSONLoader            ,
  AmbientLight          ,
  WebGLRenderer         ,
  DirectionalLight      ,
  PerspectiveCamera     ,
  MeshStandardMaterial  ,
} from 'three';

import { Component, ElementRef } from '@angular/core';
import { SmoothShading         } from 'three/src/constants.js';

import { SoundsService         } from '../../services/sounds.service';
import { LoadingService        } from '../../services/loading.service';


@Component({
  selector: 'more',
  templateUrl: 'components/more/more.component.html'
})


export class MoreComponent {
  constructor(more, sounds, loading) {
    this.scene    = null;
    this.light    = null;
    this.camera   = null;
    this.renderer = null;
    this.bluePill = null;
    this.redPill  = null;
    this.raining  = null;
    this.choice   = null;

    this.WHITE    = 0xFFFFFF;
    this.BLACK    = 0x000000;
    this.GRAY     = 0x444444;
    this.BLUE     = 0x003FFF;
    this.RED      = 0xB40000;

    this.fadeOut  = false;
    this.goToMenu = false;
    this.showRed  = false;
    this.showBlue = false;

    this.audio    = sounds;
    this.loading  = loading;
    this.more     = more.nativeElement;

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createSpeech();

    this.loadPill(this.BLUE);
    this.loadPill(this.RED);
  }

  createScene() {
    this.scene = new Scene();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 7.5;
  }

  createLights() {
    this.scene.add(new AmbientLight(this.GRAY));

    let light = new DirectionalLight(this.WHITE, 0.5);
    light.position.set(25, 50, -50);
    light.castShadow = true;
    this.scene.add(light);

    light = new SpotLight(this.WHITE, 1, 100, 1, 0, 1);
    light.position.set(-25, 25, 5);
    this.scene.add(light);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.BLACK, 0);

    this.renderer.domElement.id = 'pills';
    this.more.appendChild(this.renderer.domElement);
  }

  createSpeech() {
    this.audio.playSpeach();
  }

  createResizeHandler() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  loadPill(color) {
    const jsonLoader = new JSONLoader();

    let pillMaterial = {
      shading           : SmoothShading,
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
      let pill = new Mesh(geometry, new MeshStandardMaterial(pillMaterial));

      if (color === this.BLUE) {
        pill.rotation.set(0, -1.5, -0.4);
        pill.position.set(2.5, 0, 2);
        this.bluePill = pill;
        this.showBlue = true;

      } else {
        pill.rotation.set(-0.05, 1.3, 0.4);
        pill.position.set(-2.5, 0.2, 2);
        this.redPill = pill;

        setTimeout(() => {
          this.showRed = true;
          setTimeout(this.createChoice.bind(this), 8500);
        }, 7500);
      }

      pill.scale.set(0.2, 0.2, 0.2);
      this.scene.add(pill);
    });
  }

  createChoice() {
    this.choice   = false;
    this.showRed  = false;
    this.showBlue = false;

    setTimeout(() => {
      this.raining      = true;
      this.visiblePills = true;
    }, 1000);

    this.pillChoice = this.setChosenPill.bind(this);
    document.addEventListener('keydown', this.pillChoice, false);
  }

  setChosenPill(event) {
    const code = event.keyCode;

    if (code === 37 || code === 39) {
      this.choice = !this.choice;
      this.animate();
    }

    else if (code === 13) {
      document.removeEventListener('keydown', this.pillChoice, false);
      this.animateChosenPill();
    }
  }

  animate() {
    this.frame = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);

    if (this.bluePill && this.redPill) {
      if (this.showBlue && this.bluePill.material.opacity < 0.8) { // 0.6
        this.bluePill.material.opacity += 0.01;
      }

      if (this.showRed && this.redPill.material.opacity < 0.8) { // 0.6
        this.redPill.material.opacity += 0.01;
      }

      if (this.choice === false && this.redPill.scale.x > 0.1) {
        this.redPill.scale.x           -= 0.01;
        this.redPill.scale.y           -= 0.01;
        this.redPill.scale.z           -= 0.01;
        this.redPill.material.opacity  -= 0.01;

        this.bluePill.scale.x          += 0.01;
        this.bluePill.scale.y          += 0.01;
        this.bluePill.scale.z          += 0.01;
        this.bluePill.material.opacity += 0.01;
      }

      if (this.choice === true && this.redPill.scale.x < 0.3) {
        this.redPill.scale.x           += 0.01;
        this.redPill.scale.y           += 0.01;
        this.redPill.scale.z           += 0.01;
        this.redPill.material.opacity  += 0.01;

        this.bluePill.scale.x          -= 0.01;
        this.bluePill.scale.y          -= 0.01;
        this.bluePill.scale.z          -= 0.01;
        this.bluePill.material.opacity -= 0.01;
      }

      let redScaleDone  = this.redPill.scale.x  >= 0.3 && this.bluePill.scale.x <= 0.1;
      let blueScaleDone = this.bluePill.scale.x >= 0.3 && this.redPill.scale.x  <= 0.1;

      if (this.visiblePills && (redScaleDone || blueScaleDone)) {
        cancelAnimationFrame(this.frame);
      }
    }
  }

  animateChosenPill() {
    this.choiceAnimation = requestAnimationFrame(this.animateChosenPill.bind(this));
    this.renderer.render(this.scene, this.camera);

    if (!this.choice && this.bluePill.position.z < 5) {
      this.bluePill.position.z += 0.125;

      if (this.bluePill.position.x > 0)
        this.bluePill.position.x -= 0.125;

      if (this.bluePill.rotation.x > 0)
        this.bluePill.rotation.x += 0.125;

      if (this.bluePill.rotation.z > -0.9)
        this.bluePill.rotation.z -= 0.0375;

    } else if (this.choice && this.redPill.position.z < 5) {
      this.redPill.position.z += 0.125;

      if (this.redPill.position.x < 0)
        this.redPill.position.x += 0.125;

      if (this.redPill.rotation.y > 0.8)
        this.redPill.rotation.y -= 0.025;

      if (this.redPill.rotation.z < 1.5)
        this.redPill.rotation.z += 0.05;

    } else {
      setTimeout(this.loading.loadPillChoice.bind(this.loading), 5500, this.choice);
      cancelAnimationFrame(this.choiceAnimation);
      this.goToMenu = true;

      setTimeout(() => {
        this.raining = false;
        this.fadeOut = true;
      }, 2500);
    }
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  ngAfterViewInit() {
    this.more = this.more.getElementsByClassName('more-component')[0];
    this.createResizeHandler();
    this.createRenderer();
    this.animate();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  static get parameters() {
    return [
      [ElementRef],
      [SoundsService],
      [LoadingService]
    ];
  }
}
