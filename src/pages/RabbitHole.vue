<template>
  <article ref="hole" itemscope itemtype="http://schema.org/WebPageElement" class="rabbit-hole-page">
    <canvas v-show="messageEnded" class="renderer"></canvas>

    <!-- <transition appear name="overlay">
      <div v-if="showFilter" class="filter-overlay" :class="{'fade-out': fadeOut}">

        <transition appear>
          <div v-if="showSuggestion" class="suggestions">
            <span>{{ suggestion }}</span>
          </div>
        </transition>
      </div>
    </transition> -->

    <div class="guidelines-container">
      <p ref="message" class="guidelines-text">{{ guidelines }}</p>

      <transition appear>
        <p v-if="showResizeMessage" class="guidelines-text warning-text">
          It seems that your browser window is not full size.
          Please, be sure to maximize it in order to fully enjoy this experience.
        </p>
      </transition>

      <transition appear>
        <div v-show="showSuggestion" class="suggestions">
          <span>{{ suggestion }}</span>
        </div>
      </transition>
    </div>

    <ScreenOverlay v-if="visibleOverlay" />
  </article>
</template>

<script>
import { MeshStandardMaterial } from '@three/materials/MeshStandardMaterial'
import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial'

import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { WebGLRenderer } from '@three/renderers/WebGLRenderer'

import { PlaneGeometry } from '@three/geometries/PlaneGeometry'
import { Scene } from '@three/scenes/Scene'
import { Mesh } from '@three/objects/Mesh'

import { TextureLoader } from '@three/loaders/TextureLoader'
import { JSONLoader } from '@three/loaders/JSONLoader'

import { AmbientLight } from '@three/lights/AmbientLight'
import { SpotLight } from '@three/lights/SpotLight'

import { Raycaster } from '@three/core/Raycaster'
import { Object3D } from '@three/core/Object3D'

import { Vector2 } from '@three/math/Vector2'
import { Color } from '@three/math/Color'

import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import Experiments from '@/assets/data/experiments.json'
import ScreenOverlay from '@/atoms/ScreenOverlay'

import Controls from '@/3D/utils/Controls'
import Lettering from '@/utils/Lettering'
import Loading from '@/utils/Loading'
import Sounds from '@/utils/Sounds'

import load from '@/3D/utils/assetsLoader'
import Viewport from '@/mixins/Viewport'
import Platform from '@/platform'
import to from 'await-to-js'
import anime from 'animejs'

import FRONT_CEILING from '@/3D/assets/textures/front_ceiling.jpg'
import SIDE_CEILING from '@/3D/assets/textures/side_ceiling.jpg'
import DOOR_WALL from '@/3D/assets/textures/door_wall.png'
import FLOOR from '@/3D/assets/textures/floor.jpg'
import WALL from '@/3D/assets/textures/wall.jpg'

import KEYBOARD from '@/3D/assets/models/keyboard.json'
import MONITOR from '@/3D/assets/models/monitor.json'
import TABLE from '@/3D/assets/models/table.json'
import FRAME from '@/3D/assets/models/frame.json'
import DOOR from '@/3D/assets/models/door.json'
import CASE from '@/3D/assets/models/case.json'

import {
  SmoothShading,
  MirroredRepeatWrapping
} from '@three/constants.js'

const PI_2 = Math.PI / 2

const GREEN = 0x496F61
const WHITE = 0xFFFFFF

export default {
  name: 'RabbitHole',

  mixins: [Viewport, FirePrerenderEvent],

  components: {
    ScreenOverlay
  },

  data () {
    return {
      showResizeMessage: false,
      forceSuggestion: false,
      messageEnded: false,

      visibleOverlay: true,
      introPlayed: false,
      // showFilter: false,
      isFullsize: false,

      introStarted: false,
      experiment: false,
      rightDoor: false,
      pressed: false,
      exit: false,
      ready: false,
      error: false,
      canOpen: false,
      fadeOut: false,

      selectedDoor: null,
      rightLight: null,
      leftLight: null,
      backLight: null,
      renderer: null,
      camera: null,
      scene: null
    }
  },

  watch: {
    viewPort (size) {
      if (!Platform.prerenderer) {
        this.onResize()
      }

      if (!this.introPlayed) {
        const message = this.$refs.message.children.length === 242
        const guidelines = this.guidelines.length === 390
        const mainMessage = guidelines && message

        this.showResizeMessage = mainMessage && !this.isFullsize
      }

      if (this.error) {
        this.showResizeMessage = false
      }
    }
  },

  computed: {
    showSuggestion () {
      return !this.exit && !this.visibleOverlay && (this.canOpen || this.forceSuggestion)
    },

    suggestion () {
      return this.ready ? 'Hold left mouse button to open the door' : 'Press enter to interact'
    },

    guidelines () {
      let guidelines = `
        Welcome to the real world.          ###
        Use W, A, S, D keys to move and drag you mouse to look around.##
        Press left mouse button to interact with the enviroment.#####
      `

      if (!this.isFullsize) {
        guidelines += `
          It seems that your browser window is not full size.##
          Please, be sure to maximize it in order to fully enjoy this experience.#####
        `
      }

      guidelines += 'Press  ENTER  when you\'re ready.'

      if (this.error) {
        guidelines = `
          Your shitty browser does not support Fullscreen API or Pointer Lock API.##
          You need to update it or use a better one: https://www.google.it/chrome/browser/desktop/
        `
      }

      return guidelines
    }
  },

  methods: {
    createScene () {
      this.scene = new Scene()
    },

    createCamera () {
      this.camera = new PerspectiveCamera(7, this.viewPort.width / this.viewPort.height, 1, 1000)
      this.camera.rotation.x = -Math.PI / 4.465
      this.camera.position.z = -5
      this.scene.add(this.camera)
    },

    createLight () {
      const ambientLight = new AmbientLight(WHITE, 0.25)
      const firstLight = new SpotLight(WHITE)

      firstLight.target.position.set(0, 0, this.center)
      firstLight.target.updateMatrixWorld()
      firstLight.position.set(0, 300, -75)
      firstLight.distance = 750

      const secondLight = firstLight.clone()
      secondLight.position.z = 525

      this.scene.add(firstLight)
      this.scene.add(secondLight)
      this.scene.add(ambientLight)
    },

    async createFloor () {
      const setFloor = (texture) => {
        texture.wrapS = texture.wrapT = MirroredRepeatWrapping
        texture.needsUpdate = true

        const floorMaterial = new MeshStandardMaterial({
          flatShading: SmoothShading,
          premultipliedAlpha: true,
          transparent: true,
          color: 0x406550,

          map: texture,
          roughness: 1,
          metalness: 0,
          opacity: 1
        })

        let floor = new Mesh(new PlaneGeometry(50, 500), floorMaterial)

        floor.position.set(0, -14, this.center)
        floor.rotation.x = -Math.PI / 2
        this.scene.add(floor)
      }

      await to(load(this.textureLoader, FLOOR, setFloor, true))
    },

    createWalls () {
      return new Promise(async (resolve, reject) => {
        let error, emptyWall, fullWall
        [error, emptyWall] = await to(load(this.textureLoader, DOOR_WALL))

        if (error) {
          reject(error)
          return
        }

        [error, fullWall] = await to(load(this.textureLoader, WALL))

        if (error) {
          reject(error)
          return
        }

        const lightGeometry = new PlaneGeometry(510, 75, 1, 1)
        const lightMaterial = new MeshBasicMaterial({
          transparent: true,
          color: WHITE,
          opacity: 0
        })

        this.leftLight = new Mesh(lightGeometry, lightMaterial)
        this.leftLight.position.set(-25.5, 18.5, this.center)
        this.leftLight.rotateY(PI_2)

        this.rightLight = this.leftLight.clone()
        this.rightLight.rotation.y = -PI_2
        this.rightLight.position.x = 25.5

        this.scene.add(this.rightLight)
        this.scene.add(this.leftLight)

        emptyWall.wrapS = emptyWall.wrapT = MirroredRepeatWrapping
        fullWall.wrapS = fullWall.wrapT = MirroredRepeatWrapping

        emptyWall.repeat.set(1, 1)
        fullWall.repeat.set(1, 1)

        const geometry = new PlaneGeometry(50, 65, 1, 1)
        const fullMaterial = new MeshBasicMaterial({ map: fullWall })
        const emptyMaterial = new MeshBasicMaterial({
          alphaMap: emptyWall,
          transparent: true,
          map: emptyWall,
          opacity: 10
        })

        const backWall = new Mesh(geometry, emptyMaterial)
        const frontWall = new Mesh(geometry, fullMaterial)

        frontWall.position.set(0, 18.5, this.center - 250)
        backWall.position.set(0, 18.5, this.center + 250)
        backWall.rotateY(Math.PI)

        this.backLight = backWall.clone()

        this.backLight.geometry = new PlaneGeometry(50, 75, 1, 1)
        this.backLight.material = lightMaterial
        this.backLight.position.z += 0.5

        this.scene.add(this.backLight)
        this.scene.add(frontWall)
        this.scene.add(backWall)

        for (let i = 0; i < 20; i++) {
          const material = (i % 4 > 1) ? emptyMaterial : fullMaterial
          const wall = new Mesh(geometry, material)

          let positionZ = i * 25
          let rotationY = PI_2
          let positionX = -25

          if (i % 2) {
            positionX = 25
            rotationY = -PI_2
            positionZ = (i - 1) * 25
          }

          wall.position.set(positionX, 18.5, positionZ)
          wall.rotateY(rotationY)
          this.scene.add(wall)
        }
      })
    },

    async createCeiling () {
      const ceiling = new Mesh(
        new PlaneGeometry(50, 500),
        new MeshBasicMaterial({ color: WHITE })
      )

      ceiling.position.set(0, 51, this.center)
      ceiling.rotateX(PI_2)
      this.scene.add(ceiling)

      const setFrontCeiling = (texture) => {
        texture.wrapS = texture.wrapT = MirroredRepeatWrapping
        texture.needsUpdate = true
        texture.repeat.set(1, 1)

        const material = new MeshBasicMaterial({ map: texture })
        const geometry = new PlaneGeometry(50, 6, 1, 10)
        const frontCeil = new Mesh(geometry, material)
        const backCeil = frontCeil.clone()

        frontCeil.position.set(0, 50.8, this.center - 247)
        frontCeil.rotateX(PI_2)

        backCeil.position.set(0, 50.8, this.center + 247)
        backCeil.rotation.set(PI_2, 0, -Math.PI)

        this.scene.add(frontCeil)
        this.scene.add(backCeil)
      }

      const setSideCeiling = (texture) => {
        texture.wrapS = texture.wrapT = MirroredRepeatWrapping
        texture.needsUpdate = true
        texture.repeat.set(10, 1)

        let material = new MeshBasicMaterial({ map: texture })
        let geometry = new PlaneGeometry(500, 6, 1, 10)
        let leftCeil = new Mesh(geometry, material)
        let rightCeil = leftCeil.clone()

        leftCeil.position.set(-22, 50.9, this.center)
        leftCeil.rotation.set(PI_2, 0, -PI_2)

        rightCeil.position.set(22, 50.9, this.center)
        rightCeil.rotation.set(PI_2, 0, PI_2)

        this.scene.add(rightCeil)
        this.scene.add(leftCeil)
      }

      await to(load(this.textureLoader, FRONT_CEILING, setFrontCeiling, true))
      await to(load(this.textureLoader, SIDE_CEILING, setSideCeiling, true))
    },

    async createTable () {
      const setTable = (model) => {
        const table = new Mesh(model.geometry, new MeshStandardMaterial({
          flatShading: SmoothShading,
          transparent: false,
          color: 0xBDBDBD,
          metalness: 0.1,
          roughness: 1,
          opacity: 1
        }))

        table.position.set(0, -19.8, -14.1)
        table.rotateY(Math.PI / 2)
        table.scale.set(6, 6, 6)

        this.scene.add(table)
      }

      await to(load(this.jsonLoader, TABLE, setTable))
    },

    async createComputer () {
      const setCase = (model) => {
        const systemUnit = new Mesh(model.geometry, model.materials)

        systemUnit.position.set(-1, 0, -19)
        systemUnit.scale.set(0.8, 0.8, 0.8)
        this.scene.add(systemUnit)
      }

      const setMonitor = (model) => {
        const monitor = new Mesh(model.geometry, model.materials)

        monitor.position.set(0, 0, -16.5)
        monitor.rotation.set(-0.05, 0, 0)
        monitor.scale.set(0.8, 0.8, 0.8)
        this.scene.add(monitor)
      }

      const setKeyboard = (model) => {
        const keyboard = new Mesh(model.geometry, model.materials)

        keyboard.position.set(0, 0, -16.5)
        keyboard.scale.set(0.8, 0.8, 0.8)
        this.scene.add(keyboard)
      }

      await to(load(this.jsonLoader, CASE, setCase))
      await to(load(this.jsonLoader, MONITOR, setMonitor))
      await to(load(this.jsonLoader, KEYBOARD, setKeyboard))
    },

    async createDoors () {
      return new Promise(async (resolve, reject) => {
        let error, frame, door
        [error, frame] = await to(load(this.jsonLoader, FRAME))

        if (error) {
          reject(error)
          return
        }

        [error, door] = await to(load(this.jsonLoader, DOOR))

        if (error) {
          reject(error)
          return
        }

        frame.materials[0].color = new Color(GREEN)
        frame.materials[1].color = new Color(GREEN)

        door.materials[0].color = new Color(0xEEEEEE)
        door.materials[1].color = new Color(GREEN)

        const frontFrame = new Mesh(frame.geometry, frame.materials)
        const frontDoor = new Mesh(door.geometry, door.materials)
        const OFFSET = 8.75

        frontFrame.position.set(0, -10.5, 475)
        frontFrame.rotation.y = Math.PI
        frontFrame.scale.set(4, 4, 4)

        frontDoor.position.set(OFFSET, 0, 0)
        frontDoor.rotation.y = Math.PI
        frontDoor.scale.set(4, 4, 4)

        this.scene.add(frontFrame)
        this.scene.add(frontDoor)

        const pitch = new Object3D()
        const pivot = new Object3D()

        pivot.position.set(-OFFSET, -10.4, 474.75)
        pivot.rotation.y = 0

        pivot.add(frontDoor)
        pitch.add(pivot)

        this.scene.add(pitch)
        this.doors.push({
          door: frontDoor,
          pivot: pivot
        })

        for (let i = 0; i < 10; i++) {
          const sideFrame = frontFrame.clone()
          const sideDoor = frontDoor.clone()

          const pitch = new Object3D()
          const pivot = new Object3D()

          let rotationY = PI_2
          let rotation = OFFSET

          let framePositionX = -25
          let doorPositionX = -24.8

          let positionZ = i * 50 + 50
          let pivotRotation = positionZ - OFFSET

          if (i % 2) {
            rotation = -OFFSET
            rotationY = -rotationY

            doorPositionX = -doorPositionX
            framePositionX = -framePositionX

            positionZ = (i - 1) * 50 + 50
            pivotRotation = positionZ + OFFSET
          }

          sideFrame.position.set(framePositionX, -10.5, positionZ)
          sideDoor.position.set(0, 0, rotation)
          // sideDoor.scale.set(0.8, 1.0, 1.0)

          sideFrame.rotation.y = rotationY
          sideDoor.rotation.y = rotationY
          sideDoor.index = i

          pivot.position.set(doorPositionX, -10.4, pivotRotation)
          pivot.rotation.y = 0

          this.scene.add(sideFrame)
          this.scene.add(sideDoor)
          this.scene.add(pitch)

          pivot.add(sideDoor)
          pitch.add(pivot)

          this.doors.push({
            door: sideDoor,
            pivot: pivot
          })
        }
      })
    },

    enterFullscreenMode () {
      document.addEventListener('mousedown', this._onMouseDown, false)
      document.addEventListener('mouseup', this._onMouseUp, false)

      this.forceSuggestion = false
      this.ready = true
    },

    exitFullscreenMode () {
      document.removeEventListener('mousedown', this._onMouseDown, false)
      document.removeEventListener('mouseup', this._onMouseUp, false)

      this.forceSuggestion = true
      this.ready = false
    },

    createCinematicIntro () {
      anime({
        easing: 'easeInOutQuad',
        targets: this.camera,
        duration: 5000,
        delay: 1000,
        fov: 50,

        update: () => {
          this.camera.updateProjectionMatrix()
        },

        complete: () => {
          this.introStarted = false
          this.introPlayed = true

          if (this.controls.isFullscreen()) {
            this.controls.activated = true
            this.controls.enable(true)
          }
        }
      })
    },

    createRenderer () {
      this.renderer = new WebGLRenderer({ canvas: this.$refs.hole.firstChild, antialias: true })
      this.renderer.setSize(this.viewPort.width, this.viewPort.height)
      this.renderer.setPixelRatio(window.devicePixelRatio || 1)
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.domElement.focus()
    },

    createControls () {
      this.error = this.controls.init(this.$refs.hole, this.scene, this.camera)

      if (this.error) {
        this.showResizeMessage = false
        return
      }

      this.controls.setBorders({
        front: this.center - 230,
        back: this.center + 242,
        right: 18,
        left: -18
      })
    },

    animate () {
      if (this.controls && this.introPlayed) {
        this.checkFocusDirection()
        this.controls.update()
      }

      if (this.exit) {
        if (this.fadeOut) {
          setTimeout(this.gotoNextPage.bind(this), 1500)
          cancelAnimationFrame(this.frame)
          return
        }

        this.lightFadeIn()
      }

      this.renderer.render(this.scene, this.camera)
      this.frame = requestAnimationFrame(this.animate.bind(this))
    },

    checkFocusDirection () {
      const direction = this.controls.getCameraDirection()

      this.canOpen = false
      this.raycaster.setFromCamera(this.focus, this.camera)
      this.raycaster.ray.direction.copy(direction).applyEuler(this.camera.rotation)

      const doors = Array.from(this.doors, doors => doors.door)
      const intersects = this.raycaster.intersectObjects(doors)

      if (intersects.length) {
        const door = this.doors.filter((mesh) => {
          return mesh.door.id === intersects[0].object.id
        })

        this.canOpen = true
        this.openTheDoor(door[0])
      } else if (this.selectedDoor) {
        this.openTheDoor()
      }
    },

    openTheDoor (door = this.selectedDoor) {
      if (!this.selectedDoor) {
        this.selectedDoor = door
      }

      if (this.pressed && door.pivot.rotation.y < 1.56) {
        if (!door.pivot.rotation.y && this.playDoorSound(door.door.index)) {
          return
        }

        door.pivot.rotation.y += 0.01
      } else if (!this.pressed && door.pivot.rotation.y > 1) {
        door.pivot.rotation.y += 0.01
      } else if (!this.pressed && door.pivot.rotation.y > 0) {
        door.pivot.rotation.y -= 0.02
      }

      if (door.pivot.rotation.y > 1.56) {
        door.pivot.rotation.y = 1.56
        this.fadeOut = true
      }

      if (door.pivot.rotation.y > 1) {
        this.rightDoor = door.door.position.z < 0
        this.experiment = !!door.door.position.z
      } else if (door.pivot.rotation.y > 0.5) {
        this.canOpen = false
        this.exit = true
      }

      if (door.pivot.rotation.y <= 0) {
        this.rightLight.material.opacity = 0
        this.leftLight.material.opacity = 0
        this.backLight.material.opacity = 0

        door.pivot.rotation.y = 0
        this.selectedDoor = null
        this.exit = false
      }
    },

    playDoorSound (door) {
      const closed = door >= Experiments.length

      if (closed) {
        Sounds.closedDoor()
      } else {
        Sounds.openedDoor()
      }

      return closed
    },

    gotoNextPage () {
      this.controls.enable(false)
      this.removeEventListeners()
      this.exitFullscreenMode()

      if (this.experiment && this.selectedDoor) {
        const index = this.selectedDoor.door.index
        const experiment = Experiments[index].route

        this.fadeOut = false
        this.exit = false

        this.selectedDoor.pivot.rotation.y = 0
        this.$router.push({ name: experiment })
      } else {
        Loading.checkActiveItem(true)
        this.$router.push({ name: 'SiteMenu' })
      }
    },

    lightFadeIn () {
      if (this.experiment) {
        const light = this.rightDoor ? this.rightLight : this.leftLight
        light.material.opacity += 0.01
      } else {
        this.backLight.material.opacity += 0.01
      }
    },

    onMouseDown (event) {
      if (event.which !== 1) return
      this.pressed = this.controls.isFullscreen()
    },

    onMouseUp () {
      this.pressed = false
    },

    onKeyDown (event) {
      const ready = this.isFullsize && event.keyCode === 13
      const inFullscreen = this.controls.isFullscreen()

      if (this.introStarted) return

      if (!this.introPlayed && !this.messageEnded) {
        this.lettering.skipLettering()
        this.messageEnded = true
        return
      }

      if (ready && !this.introPlayed) {
        this.controls.setFullscreenMode(true)
        this.controls.enable(false)
        this.introStarted = true

        setTimeout(() => {
          this.lettering.dispose()
        }, 500)

        setTimeout(() => {
          this.createCinematicIntro()
        }, 1500)

        setTimeout(() => {
          this.visibleOverlay = false
        }, 3000)
      }

      if (ready) {
        if (inFullscreen) {
          this.controls.setFullscreenMode(false)
          this.exitFullscreenMode()
        } else {
          this.controls.setFullscreenMode(true)
          this.enterFullscreenMode()
        }
      }
    },

    onResize () {
      this.renderer.setSize(this.viewPort.width, this.viewPort.height)
      this.isFullsize = window.outerWidth >= (screen.width - 20)

      this.camera.aspect = this.viewPort.width / this.viewPort.height
      this.camera.updateProjectionMatrix()
    },

    onBlur () {
      this.controls.setFullscreenMode(false)
      this.exitFullscreenMode()
    },

    createEventListeners () {
      this._onMouseDown = this.onMouseDown.bind(this)
      this._onMouseUp = this.onMouseUp.bind(this)
      this._onKeyDown = this.onKeyDown.bind(this)
      this._onBlur = this.onBlur.bind(this)

      document.addEventListener('mousedown', this._onMouseDown, false)
      document.addEventListener('mouseup', this._onMouseUp, false)
      document.addEventListener('keydown', this._onKeyDown, false)
      window.addEventListener('blur', this._onBlur, false)

      this.controls.exitFullscreenCallback(() => {
        this.controls.enable(false)
        this.exitFullscreenMode()
      })
    },

    removeEventListeners () {
      document.removeEventListener('mousedown', this._onMouseDown, false)
      document.removeEventListener('mouseup', this._onMouseUp, false)
      document.removeEventListener('keydown', this._onKeyDown, false)
      window.removeEventListener('blur', this._onBlur, false)
      this.controls.dispose()
    }
  },

  beforeCreate () {
    this.$emit('hide:overlay')
  },

  mounted () {
    if (!Platform.prerenderer) {
      this.textureLoader = new TextureLoader()
      this.jsonLoader = new JSONLoader()

      this.raycaster = new Raycaster()
      this.focus = new Vector2()

      this.lettering = new Lettering()
      this.controls = new Controls()

      this.raycaster.far = 15
      this.center = 225
      this.doors = []

      this.focus.x = 0
      this.focus.y = 2

      this.createScene()
      this.createCamera()
      this.createLight()

      this.createFloor()
      this.createWalls()
      this.createCeiling()
      this.createDoors()

      this.createTable()
      this.createComputer()

      this.createRenderer()
      this.createControls()

      if (!this.error) {
        this.createEventListeners()
        this.onResize()
        this.animate()
      }

      setTimeout(() => {
        this.lettering.animate(
          this.$refs.message, 50, () => {
            this.messageEnded = true
          }, 0
        )
      })
    }
  },

  beforeDestroy () {
    cancelAnimationFrame(this.frame)
    this.removeEventListeners()
    delete this.controls
  },

  metaInfo: {
    title: 'Rabbit Hole |'
  }
}
</script>

<style scoped lang="scss">
@import 'variables';
@import 'mixins';

.rabbit-hole-page {
  background-color: $black;
  position: absolute;
  overflow: hidden;
  cursor: default;
  // cursor: none;

  height: 100%;
  width: 100%;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  .renderer {
    position: absolute;
    height: 100%;
    width: 100%;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }

  // .filter-overlay {
  //   transition: background-color 1s linear;
  //   background-color: $green-overlay;

  //   position: absolute;
  //   // z-index: $max;

  //   height: 100%;
  //   width: 100%;

  //   bottom: 0;
  //   right: 0;
  //   left: 0;
  //   top: 0;

  //   &.fade-out {
  //     background-color: $white;
  //   }

  //   .suggestions {
  //     @include white-rabbit;

  //     transform: translateX(-50%);
  //     text-transform: uppercase;
  //     background-color: $black;
  //     position: absolute;

  //     border-radius: 5px;
  //     padding: 10px;
  //     bottom: 20px;
  //     left: 50%;
  //   }
  // }

  .suggestions {
    @include white-rabbit;

    transform: translateX(-50%);
    text-transform: uppercase;
    background-color: $black;
    position: absolute;

    border-radius: 5px;
    padding: 10px;
    bottom: 20px;
    left: 50%;
  }

  .guidelines-container {
    position: absolute;
    z-index: $screen;
    margin: auto;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }

  .guidelines-text {
    @include white-rabbit;

    visibility: hidden;
    position: relative;

    margin-left: 50px;
    margin-top: 75px;

    height: 70px;
    width: 920px;

    &.warning-text {
      visibility: visible;
      line-height: 28px;
      margin-top: 200px;
    }
  }
}
</style>
