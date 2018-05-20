import World from './World'
import ElasticCameraController from '@/3d/controllers/ElasticCameraController'
import { promiseLoad, promiseParse } from '@/3d/utils/loaderPromise'
import to from 'await-to-js'
// threejs
import { DirectionalLight } from '@three/lights/DirectionalLight'
import { AmbientLight } from '@three/lights/AmbientLight'
import { CubeTextureLoader } from '@three/loaders/CubeTextureLoader'
import { RGBFormat } from '@three/constants'
import { GLTFLoader } from '@three/loaders/GLTFLoader'

/*
 * TODO: documentation
 *
 *
 *
 *
 *
 */
export default {
  name: 'GLTFViewerWorld',

  mixins: [World],

  props: {
    gltf: {
      required: true
    },
    envMap: {
      required: false,
      default () {
        return [
          import('@/3d/assets/envmaps/park2/posx.jpg'), import('@/3d/assets/envmaps/park2/negx.jpg'),
          import('@/3d/assets/envmaps/park2/posy.jpg'), import('@/3d/assets/envmaps/park2/negy.jpg'),
          import('@/3d/assets/envmaps/park2/posz.jpg'), import('@/3d/assets/envmaps/park2/negz.jpg')
        ]
      }
    },
    scale: {
      required: false,
      default: 1
    },
    // this stuff sets rendering preferences
    rendererData: {
      required: false,
      default () {
        return {
          bloomPass: {
            strength: 1
          }
        }
      }
    }
  },

  created () {
    this.cameraController = new ElasticCameraController({
      camera: this.camera,
      width: this.width,
      height: this.height,
      radius: 5,
      radiusMin: 2,
      radiusMax: 10
    })
  },

  methods: {
    load () {
      return new Promise(async (resolve, reject) => {
        // load gltf
        let error
        let gltf
        [error, gltf] = await to(this.loadGLTF(this.gltf))
        if (error) {
          reject(error)
          return
        }
        // set it as this scene
        this.scene = gltf.scene

        // load envmap
        let envMap
        [error, envMap] = await to(this.loadEnvMap(this.envMap))
        // check if envmap has loaded OK
        // (considered optional and ignored if not specified)
        if (!error) {
          this.scene.background = envMap
          // sets env texture on all children
          this.scene.traverse(function (child) {
            if (child.isMesh) {
              child.material.envMap = envMap
            }
          })
        }

        // setup lighs
        let light = new DirectionalLight(0xffffff, 1)
        light.position.set(0, 20, -5)
        this.scene.add(light)

        this.scene.add(new AmbientLight(0xffffff, 0.1))
        this.scene.scale.set(this.scale, this.scale, this.scale)
        // resolve the promise
        resolve()
        this.isLoaded = true
      })
    },

    loadEnvMap (files) {
      return new Promise(async (resolve, reject) => {
        if (files) {
          let envmapFiles
          if (files[0].toString() === '[object Promise]') {
            let error
            // load promises
            [error, envmapFiles] = await to(Promise.all(files))
            if (error) {
              reject(error)
              return
            }
            envmapFiles = envmapFiles.map(file => file.default)
          } else {
            envmapFiles = files
          }

          if (envmapFiles) {
            // load env map
            let [error, envMap] = await to(promiseLoad(new CubeTextureLoader(), envmapFiles))
            if (error) {
              reject(error)
              return
            }
            envMap.format = RGBFormat
            resolve(envMap)
          }
        } else {
          reject(new Error('No Envmap Specified'))
        }
      })
    },

    loadGLTF (file) {
      return new Promise(async (resolve, reject) => {
        if (file) {
          let gltfFile
          if (file.toString() === '[object Promise]') {
            let error
            [error, gltfFile] = await to(file)
            if (error) {
              reject(error)
              return
            }
            gltfFile = gltfFile.default
          } else {
            gltfFile = file
          }

          // load gltf scene
          let [error, gltf] = await to(promiseParse(new GLTFLoader(), gltfFile, ''))
          if (error) {
            reject(error)
            return
          }
          resolve(gltf)
        } else {
          reject(new Error('No GLTF specified'))
        }
      })
    },

    handleMouseUp (event) {
      this.cameraController.onMouseUp(event)
    },

    handleMouseDown (event) {
      this.cameraController.onMouseDown(event)
    },

    handleMouseMove (event) {
      this.cameraController.onMouseMove(event)
    },
    handleMouseWheel (event) {
      this.cameraController.radius += event.pixelY * 0.002
    },

    handleResize () {
      World.methods.handleResize.bind(this)()

      this.cameraController.width = this.width
      this.cameraController.height = this.height
    },

    update (delta = 1 / 60) {
      World.methods.update.bind(this)(delta)
      this.cameraController.update(delta)
    }
  }
}
