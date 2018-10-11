import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial'
import { ShaderMaterial } from '@three/materials/ShaderMaterial'

import { EffectComposer } from '@three/postprocessing/EffectComposer'
import { RenderPass } from '@three/postprocessing/RenderPass'
import { ShaderPass } from '@three/postprocessing/ShaderPass'

import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'

import { PlaneGeometry } from '@three/geometries/PlaneGeometry'
import { Detector } from '@three/helpers/Detector'
import { Texture } from '@three/textures/Texture'

import { TextureLoader } from '@three/loaders/TextureLoader'
import { LinearFilter } from '@three/constants.js'

import { Scene } from '@three/scenes/Scene'
import { Mesh } from '@three/objects/Mesh'

import Fall from '@/3D/assets/lut-tables/Fall.png'
import Warm from '@/3D/assets/lut-tables/Warm.png'
import Night1 from '@/3D/assets/lut-tables/Night1.png'
import Night2 from '@/3D/assets/lut-tables/Night2.png'
import Night3 from '@/3D/assets/lut-tables/Night3.png'
import SunSet from '@/3D/assets/lut-tables/SunSet.jpg'
import Evening from '@/3D/assets/lut-tables/Evening.png'
import Filmic1 from '@/3D/assets/lut-tables/Filmic1.png'
import Filmic2 from '@/3D/assets/lut-tables/Filmic2.png'
import Filmic3 from '@/3D/assets/lut-tables/Filmic3.png'
import Filmic4 from '@/3D/assets/lut-tables/Filmic4.png'
import Filmic5 from '@/3D/assets/lut-tables/Filmic5.png'
import Filmic6 from '@/3D/assets/lut-tables/Filmic6.png'
import Filmic7 from '@/3D/assets/lut-tables/Filmic7.png'
import Filmic8 from '@/3D/assets/lut-tables/Filmic8.png'
import Filmic9 from '@/3D/assets/lut-tables/Filmic9.png'
import Standard from '@/3D/assets/lut-tables/Standard.png'
import MatrixBlue from '@/3D/assets/lut-tables/MatrixBlue.png'
import CandleLight from '@/3D/assets/lut-tables/CandleLight.png'
import MatrixGreen from '@/3D/assets/lut-tables/MatrixGreen.png'
import MissEtikate from '@/3D/assets/lut-tables/MissEtikate.png'
import StrongAmber from '@/3D/assets/lut-tables/StrongAmber.png'
import YellowToRed from '@/3D/assets/lut-tables/YellowToRed.png'
import StrongYellow from '@/3D/assets/lut-tables/StrongYellow.png'
import BleachBypass from '@/3D/assets/lut-tables/BleachBypass.png'
import CoolContrast from '@/3D/assets/lut-tables/CoolContrast.png'
import WarmContrast from '@/3D/assets/lut-tables/WarmContrast.png'
import DesaturatedFog from '@/3D/assets/lut-tables/DesaturatedFog.png'
import SelectiveColor from '@/3D/assets/lut-tables/SelectiveColor.png'

import fragGrading from '@/3D/glsl/ColorGrading/videoGrading.frag'
import vertGrading from '@/3D/glsl/ColorGrading/grading.vert'

import load from '@/3D/utils/assetsLoader'
import * as dat from 'dat.gui'
import to from 'await-to-js'

export default class ColorGrading {
  constructor () {
    this.width = 1920
    this.height = 1080

    this.ratio = this.width / this.height
    this.textureLoader = new TextureLoader()
  }

  startExperiment (container, videoName) {
    this.createVideoStream(videoName)
    this.container = container
  }

  createVideoStream (file) {
    this.video = document.createElement('video')
    this.video.src = `/static/video/${file}.mp4`

    this.video.loop = true
    this.video.muted = true
    this.video.preload = true

    this.video.width = this.width
    this.video.height = this.height

    this.video.oncanplay = this.init.bind(this)
  }

  init () {
    if (this.renderer) return

    if (!Detector.webgl) {
      document.body.appendChild(Detector.getWebGLErrorMessage())
      return
    }

    this.createWebGLEnvironment()
    this.createVideoGeometry()
    this.setColorGrading()
    this.createTables()

    this.video.play()
    this.onResize()
    this.render()
  }

  createWebGLEnvironment () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.scene = new Scene()

    this.camera = new PerspectiveCamera(45, this.ratio, 1, 10000)
    this.camera.position.z = Math.round(this.height / 0.8275862)
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
  }

  createVideoGeometry () {
    this.videoTexture = new Texture(this.video)

    this.videoTexture.minFilter = LinearFilter
    this.videoTexture.magFilter = LinearFilter

    this.scene.add(new Mesh(
      new PlaneGeometry(this.width, this.height, 1, 1),
      new MeshBasicMaterial({ map: this.videoTexture })
    ))
  }

  setColorGrading (lutTable = Standard, create = true, lookup = false) {
    return new Promise(async (resolve, reject) => {
      let error, table
      [error, table] = await to(load(this.textureLoader, lutTable))

      if (error) {
        reject(error)
        return
      }

      table.minFilter = LinearFilter
      table.magFilter = LinearFilter

      if (create) {
        this.grading = new ShaderPass(
          new ShaderMaterial({
            fragmentShader: fragGrading,
            vertexShader: vertGrading,

            uniforms: {
              texture: { type: 't', value: this.videoTexture },
              grading: { type: 't', value: table },
              isLookup: { type: 'i', value: 0 }
            }
          })
        )

        this.composer.addPass(this.grading)
        this.grading.renderToScreen = true
      } else {
        this.grading.material.uniforms.grading.value = table
        this.grading.material.uniforms.isLookup.value = lookup
      }
    })
  }

  createTables () {
    const lutTables = {
      Standard: Standard,

      Filmic1: Filmic1,
      Filmic2: Filmic2,
      Filmic3: Filmic3,
      Filmic4: Filmic4,
      Filmic5: Filmic5,
      Filmic6: Filmic6,
      Filmic7: Filmic7,
      Filmic8: Filmic8,
      Filmic9: Filmic9,

      Night1: Night1,
      Night2: Night2,
      Night3: Night3,

      MatrixBlue: MatrixBlue,
      MatrixGreen: MatrixGreen,

      Fall: Fall,
      SunSet: SunSet,
      Evening: Evening,

      Warm: Warm,
      WarmContrast: WarmContrast,

      StrongAmber: StrongAmber,
      YellowToRed: YellowToRed,
      StrongYellow: StrongYellow,
      CandleLight: CandleLight,
      CoolContrast: CoolContrast,
      BleachBypass: BleachBypass,
      DesaturatedFog: DesaturatedFog,
      SelectiveColor: SelectiveColor,
      MissEtikate: MissEtikate
    }

    const lutArray = Object.keys(lutTables)
    this.gui = new dat.GUI()

    this.gui.add({ LUT: 'Standard' }, 'LUT', lutArray).onChange((table) => {
      const lookup = lutArray.indexOf(table) > lutArray.length - 3
      this.setColorGrading(lutTables[table], false, lookup)
    })
  }

  onResize () {
    let _height = window.innerHeight
    let _width = window.innerWidth

    if (window.innerWidth > window.innerHeight) {
      _height = window.innerWidth / 16 * 9
    } else {
      _width = window.innerHeight / 9 * 16
    }

    this.video.width = _width
    this.video.height = _height

    if (this.renderer) {
      this.renderer.setSize(_width, _height)
    }
  }

  render () {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoTexture.needsUpdate = true
      this.composer.render()
    }

    this.frame = requestAnimationFrame(this.render.bind(this))
  }

  destroy () {
    cancelAnimationFrame(this.frame)
    this.gui.domElement.remove()
    delete this.gui

    this.video.oncanplay = null
    this.video = null
  }
}
