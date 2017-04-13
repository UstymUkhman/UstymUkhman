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


@Component({
  template: '',
  selector: 'rabbit-hole'
})


export class RabbitHoleComponent {
  constructor(rabbitHole) {
    this.scene    = null;
    this.light    = null;
    this.camera   = null;
    this.renderer = null;
    this.hole     = rabbitHole.nativeElement;

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createRenderer();
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
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.BLACK, 0);

    this.renderer.domElement.id = 'pills';
    this.hole.appendChild(this.renderer.domElement);
  }

  // ngAfterViewInit() {
  //   this.more = this.more.getElementsByClassName('more-component')[0];
  //   this.createRenderer();
  //   this.animate();
  // }

  static get parameters() {
    return [[ElementRef]];
  }
}
