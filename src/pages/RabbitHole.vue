<template>
  <article itemscope itemtype="http://schema.org/WebPageElement" class="rabbit-hole-page">
    <canvas v-show="messageEnded" ref="hole" class="renderer"></canvas>

    <transition appear name="overlay">
      <div v-if="showFilter" class="filter-overlay" :class="{'fade-out': fadeOut}">
        <transition v-if="showSuggestion" appear>
          <div class="suggestions">
            <span>{{ suggestion }}</span>
          </div>
        </transition>
      </div>
    </transition>

    <div v-if="!introPlayed" class="guidelines-container" :class="{'on-top': introStarted}">
      <p ref="message" class="guidelines-text info-text" :class="{'dissolve': showFilter}">
        {{ guidelines }}
      </p>

      <transition appear>
        <p v-if="showResizeMessage" class="guidelines-text warning-text">
          It seems that your browser window is not full size.
          Please, be sure to maximize it in order to fully enjoy this experience.
        </p>
      </transition>
    </div>

    <ScreenOverlay v-if="showOverlay" class="screen-overlay" :class="{'on-top': introStarted}" />
  </article>
</template>

<script>
import Experiments from '@/assets/data/experiments.json'
import ScreenOverlay from '@/atoms/ScreenOverlay'

import Controls from '@/services/Controls'
import Loading from '@/services/Loading'
import Sounds from '@/services/Sounds'

import Lettering from '@/utils/Lettering'
import Viewport from '@/mixins/Viewport'
import Platform from '@/platform'
import * as THREE from 'three'

export default {
  name: 'RabbitHole',

  mixins: [Viewport],

  components: {
    ScreenOverlay
  },

  data () {
    return {
      showResizeMessage: false,
      forceSuggestion: false,
      messageEnded: false,

      introPlayed: false,
      showOverlay: true,
      showFilter: false,
      isFullsize: false,

      introStarted: false,
      experiment: false,
      rightDoor: false,
      pressed: false,
      intro: false,
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
      scene: null,

      WHITE: 0xFFFFFF,
      LIGHTGRAY: 0xEEEEEE,
      GREEN: 0x496F61,
      DARKGREEN: 0x406550,
      BLACK: 0x000000
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
      return this.canOpen || this.forceSuggestion
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

        this.showResizeMessage = false
      }

      return guidelines
    }
  },

  methods: {
    createScene () {
      this.scene = new THREE.Scene()
    },

    createCamera () {
      this.camera = new THREE.PerspectiveCamera(7, this.viewPort.width / this.viewPort.height, 1, 1000)
      this.camera.rotation.x = -Math.PI / 4.465
      this.camera.position.z = -5
      this.scene.add(this.camera)
    },

    createLight () {
      const ambientLight = new THREE.AmbientLight(this.WHITE, 0.25)
      const firstLight = new THREE.SpotLight(this.WHITE)

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

    createFloor () {
      const textureLoader = new THREE.TextureLoader()

      textureLoader.load('/static/img/textures/floor.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
        texture.needsUpdate = true

        const floorMaterial = new THREE.MeshStandardMaterial({
          shading: THREE.SmoothShading,
          premultipliedAlpha: true,
          color: this.DARKGREEN,
          transparent: true,

          map: texture,
          roughness: 1,
          metalness: 0,
          opacity: 1
        })

        let floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 500), floorMaterial)

        floor.position.set(0, -14, this.center)
        floor.rotation.x = -Math.PI / 2
        this.scene.add(floor)
      })
    },

    createWalls () {
      let textureLoader = new THREE.TextureLoader()

      textureLoader.load('/static/img/textures/wall.png', (emptyWall) => {
        textureLoader.load('/static/img/textures/wall.jpg', (fullWall) => {
          const PI_2 = Math.PI / 2

          const lightGeometry = new THREE.PlaneGeometry(510, 75, 1, 1)
          const lightMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            color: this.WHITE,
            opacity: 0
          })

          this.leftLight = new THREE.Mesh(lightGeometry, lightMaterial)
          this.leftLight.position.set(-25.5, 18.5, this.center)
          this.leftLight.rotateY(PI_2)

          this.rightLight = this.leftLight.clone()
          this.rightLight.rotation.y = -PI_2
          this.rightLight.position.x = 25.5

          this.scene.add(this.rightLight)
          this.scene.add(this.leftLight)

          emptyWall.wrapS = emptyWall.wrapT = THREE.MirroredRepeatWrapping
          fullWall.wrapS = fullWall.wrapT = THREE.MirroredRepeatWrapping

          emptyWall.needsUpdate = true
          fullWall.needsUpdate = true

          emptyWall.repeat.set(1, 1)
          fullWall.repeat.set(1, 1)

          const geometry = new THREE.PlaneGeometry(50, 65, 1, 1)
          const fullMaterial = new THREE.MeshBasicMaterial({ map: fullWall })
          const emptyMaterial = new THREE.MeshBasicMaterial({
            alphaMap: emptyWall,
            transparent: true,
            map: emptyWall,
            opacity: 10
          })

          const backWall = new THREE.Mesh(geometry, emptyMaterial)
          const frontWall = new THREE.Mesh(geometry, fullMaterial)

          frontWall.position.set(0, 18.5, this.center - 250)
          backWall.position.set(0, 18.5, this.center + 250)
          backWall.rotateY(Math.PI)

          this.backLight = backWall.clone()

          this.backLight.geometry = new THREE.PlaneGeometry(50, 75, 1, 1)
          this.backLight.material = lightMaterial
          this.backLight.position.z += 0.5

          this.scene.add(this.backLight)
          this.scene.add(frontWall)
          this.scene.add(backWall)

          for (let i = 0; i < 20; i++) {
            const material = (i % 4 > 1) ? emptyMaterial : fullMaterial
            const wall = new THREE.Mesh(geometry, material)

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
      })
    },

    createCeiling () {
      const PI_2 = Math.PI / 2

      const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 500),
        new THREE.MeshBasicMaterial({ color: this.WHITE })
      )

      ceiling.position.set(0, 51, this.center)
      ceiling.rotateX(PI_2)
      this.scene.add(ceiling)

      let frontCeilLoader = new THREE.TextureLoader()

      frontCeilLoader.load('/static/img/textures/front_ceiling.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
        texture.needsUpdate = true
        texture.repeat.set(1, 1)

        let material = new THREE.MeshBasicMaterial({ map: texture })
        let geometry = new THREE.PlaneGeometry(50, 6, 1, 10)
        let frontCeil = new THREE.Mesh(geometry, material)
        let backCeil = frontCeil.clone()

        frontCeil.position.set(0, 50.8, this.center - 247)
        frontCeil.rotateX(PI_2)

        backCeil.position.set(0, 50.8, this.center + 247)
        backCeil.rotation.set(PI_2, 0, -Math.PI)

        this.scene.add(frontCeil)
        this.scene.add(backCeil)
      })

      let sideCeilLoader = new THREE.TextureLoader()

      sideCeilLoader.load('/static/img/textures/side_ceiling.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
        texture.needsUpdate = true
        texture.repeat.set(10, 1)

        let material = new THREE.MeshBasicMaterial({ map: texture })
        let geometry = new THREE.PlaneGeometry(500, 6, 1, 10)
        let leftCeil = new THREE.Mesh(geometry, material)
        let rightCeil = leftCeil.clone()

        leftCeil.position.set(-22, 50.9, this.center)
        leftCeil.rotation.set(PI_2, 0, -PI_2)

        rightCeil.position.set(22, 50.9, this.center)
        rightCeil.rotation.set(PI_2, 0, PI_2)

        this.scene.add(rightCeil)
        this.scene.add(leftCeil)
      })
    },

    createTable () {
      this.loader.load('/static/models/table.json', (geometry) => {
        const material = new THREE.MeshStandardMaterial({
          shading: THREE.SmoothShading,
          transparent: false,
          color: 0xBDBDBD,
          metalness: 0.1,
          roughness: 1,
          opacity: 1
        })

        const table = new THREE.Mesh(geometry, material)

        table.position.set(0, -19.8, -14.1)
        table.rotateY(Math.PI / 2)
        table.scale.set(6, 6, 6)
        this.scene.add(table)
      })
    },

    createComputer () {
      this.loader.load('/static/models/case.json', (geometry, materials) => {
        const systemUnit = new THREE.Mesh(geometry, materials)

        systemUnit.position.set(-1, 0, -19)
        systemUnit.scale.set(0.8, 0.8, 0.8)
        this.scene.add(systemUnit)
      })

      this.loader.load('/static/models/keyboard.json', (geometry, materials) => {
        const keyboard = new THREE.Mesh(geometry, materials)

        keyboard.position.set(0, 0, -16.5)
        keyboard.scale.set(0.8, 0.8, 0.8)
        this.scene.add(keyboard)
      })

      this.loader.load('/static/models/monitor.json', (geometry, materials) => {
        const monitor = new THREE.Mesh(geometry, materials)

        monitor.position.set(0, 0, -16.5)
        monitor.rotation.set(-0.05, 0, 0)
        monitor.scale.set(0.8, 0.8, 0.8)
        this.scene.add(monitor)
      })
    },

    createDoors () {
      this.loader.load('/static/models/frame.json', (frameGeometry, frameMaterials) => {
        this.loader.load('/static/models/door.json', (doorGeometry, doorMaterials) => {
          frameMaterials[0].color = new THREE.Color(this.GREEN)
          frameMaterials[1].color = new THREE.Color(this.GREEN)

          doorMaterials[0].color = new THREE.Color(this.LIGHTGRAY)
          doorMaterials[1].color = new THREE.Color(this.GREEN)

          const frontFrame = new THREE.Mesh(frameGeometry, frameMaterials)
          const frontDoor = new THREE.Mesh(doorGeometry, doorMaterials)
          const OFFSET = 8.75

          frontFrame.position.set(0, -10.5, 475)
          frontFrame.rotation.y = Math.PI
          frontFrame.scale.set(4, 4, 4)

          frontDoor.position.set(OFFSET, 0, 0)
          frontDoor.rotation.y = Math.PI
          frontDoor.scale.set(4, 4, 4)

          this.scene.add(frontFrame)
          this.scene.add(frontDoor)

          const pitch = new THREE.Object3D()
          const pivot = new THREE.Object3D()
          const PI_2 = Math.PI / 2

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

            const pitch = new THREE.Object3D()
            const pivot = new THREE.Object3D()

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
      setTimeout(() => {
        this.intro = true
      }, 1000)

      this.clock = new THREE.Clock()
      this.elapsedSpeed = 4.0
    },

    createRenderer () {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.hole, antialias: true })
      this.renderer.setSize(this.viewPort.width, this.viewPort.height)
      this.renderer.setPixelRatio(window.devicePixelRatio || 1)
      this.renderer.setClearColor(this.BLACK, 0)
      this.renderer.domElement.focus()
    },

    createControls () {
      this.error = this.controls.init(this.renderer.domElement, this.scene, this.camera)
      if (this.error) return

      this.controls.setBorders({
        front: this.center - 230,
        back: this.center + 242,
        right: 18,
        left: -18
      })
    },

    animate () {
      this.frame = requestAnimationFrame(this.animate.bind(this))
      this.renderer.render(this.scene, this.camera)

      if (this.intro) {
        this.animateCameraIntro()

        this.controls.exitFullscreenCallback(() => {
          this.controls.enable(false)
          this.exitFullscreenMode()
        })
      } else {
        this.checkFocusDirection()
      }

      if (this.controls && this.introPlayed) {
        this.controls.update()
      }

      if (this.exit) {
        if (this.fadeOut) {
          cancelAnimationFrame(this.frame)
          setTimeout(this.gotoNextPage.bind(this), 1500)
        }

        this.lightFadeIn()
      }
    },

    animateCameraIntro () {
      this.camera.fov = this.getCameraFov()

      if (this.camera.fov === 50) {
        this.introStarted = false
        this.introPlayed = true
        this.intro = false

        if (this.controls.isFullscreen()) {
          this.controls.enable(true)
        }
      }

      this.renderer.setViewport(0, 0, this.viewPort.width, this.viewPort.height)
      this.renderer.setScissor(0, 0, this.viewPort.width, this.viewPort.height)
      this.camera.updateProjectionMatrix()
    },

    getCameraFov () {
      this.elapsedSpeed += this.camera.fov < 20 ? 0.01 : 0.06

      const elapsedTime = this.clock.getElapsedTime()
      const zoomSpeed = elapsedTime * this.elapsedSpeed
      const cameraFov = zoomSpeed + 7

      return (cameraFov < 50) ? cameraFov : 50
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
        if (!door.pivot.rotation.y) {
          if (this.playDoorSound(door.door.index)) return
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

        // this.$ua.trackEvent('RabbitHole', 'Chosen', 'Door', Experiments[index].name)

        this.fadeOut = false
        this.exit = false

        this.selectedDoor.pivot.rotation.y = 0
        this.$router.push({ name: experiment })
      } else {
        Loading.checkActiveItem(true)
        Sounds.playMusic()

        // this.$ua.trackEvent('RabbitHole', 'Chosen', 'Door', 'Exit')
        this.$router.push({ name: 'Console' })
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

      if (ready && !inFullscreen) {
        this.controls.setFullscreenMode(true)
        this.enterFullscreenMode()
      }

      if (ready && inFullscreen) {
        this.controls.setFullscreenMode(false)
        this.exitFullscreenMode()
      }

      if (this.isFullsize && !this.introPlayed && !this.messageEnded) {
        // this.$ua.trackEvent('RabbitHole', 'Skipped', 'IntroMessage')
        this.lettering.skipLettering()
      }

      if (ready && !this.introPlayed) {
        // this.$ua.trackEvent('RabbitHole', 'Played', 'Intro')
        const delay = this.messageEnded ? 0 : 2500

        this.controls.setFullscreenMode(true)
        this.controls.enable(false)
        this.introStarted = true

        setTimeout(() => {
          this.showFilter = true
        }, delay)

        setTimeout(() => {
          this.showOverlay = false
          this.createCinematicIntro()
        }, delay + 2500)
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
      this.raycaster = new THREE.Raycaster()
      this.loader = new THREE.JSONLoader()
      this.focus = new THREE.Vector2()

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
    this.controls = null
  },

  metaInfo: {
    title: 'Rabbit Hole'
  }
}
</script>

<style scoped lang="scss">
@import 'app-colors';
@import 'z-index';

.rabbit-hole-page {
  background-color: $black;
  position: absolute;
  overflow: hidden;
  cursor: default;

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

  .filter-overlay {
    transition: background-color 1s linear;
    background-color: $green-overlay;

    position: absolute;
    z-index: $max;

    height: 100%;
    width: 100%;

    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    &.fade-out {
      background-color: $white;
    }

    .suggestions {
      transform: translateX(-50%);

      text-transform: uppercase;
      background-color: $black;
      position: absolute;

      border-radius: 5px;
      padding: 10px;
      bottom: 20px;
      left: 50%;
    }
  }

  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 2s linear 2.5s;
  }

  .overlay-enter,
  .overlay-leave-to {
    opacity: 0;
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
    position: relative;
    margin-left: 50px;

    height: 70px;
    width: 920px;

    &.info-text {
      margin-top: 75px;
    }

    &.warning-text {
      line-height: 28px;
      margin-top: 150px;
    }
  }

  .screen-overlay {
    cursor: none;
  }

  .on-top {
    z-index: $max;
  }
}
</style>


<style lang="scss">
@import 'mixins';

.rabbit-hole-page {
  .filter-overlay .suggestions {
    @include white-rabbit;
  }

  .guidelines-text {
    @include white-rabbit;

    span {
      @include dissolve-text(400);
    }

    &.dissolve {
      span {
        opacity: 0;
      }
    }
  }
}
</style>
