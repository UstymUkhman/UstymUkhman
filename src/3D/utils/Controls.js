import PointerControls from './PointerControls'
import { Vector3 } from '@three/math/Vector3'
import Platform from '@/platform'

export default class Controls {
  constructor () {
    this.lockOnly = Platform.safari || Platform.edge || Platform.firefox
    this._exitFullscreenCallback = null
    this.prevTime = performance.now()

    this.direction = new Vector3()
    this.velocity = new Vector3()

    this.inFullscreen = false
    this.activated = false
    this.controls = null
    this.enabled = false
    this.camera = null
    this.scene = null
    this.room = null

    this.move = {
      backward: false,
      forward: false,
      right: false,
      left: false
    }
  }

  init (room, scene, camera) {
    this.room = room
    this.scene = scene
    this.camera = camera
    this.enabled = true

    this.controls = new PointerControls(this.camera)
    this.scene.add(this.controls.getObject())
    this.setExperimentalAPIs()

    return !(this.fullscreen && this.pointerLock)
  }

  setExperimentalAPIs () {
    this.fullscreen =
      this.room.requestFullscreen ||
      this.room.msRequestFullscreen ||
      this.room.mozRequestFullScreen ||
      this.room.webkitRequestFullscreen

    this.pointerLock =
      this.room.requestPointerLock ||
      this.room.mozRequestPointerLock ||
      this.room.webkitRequestPointerLock

    if (this.fullscreen) {
      this.room.requestFullscreen =
        this.room.requestFullscreen ||
        this.room.msRequestFullscreen ||
        this.room.mozRequestFullScreen ||
        this.room.webkitRequestFullscreen
    }

    if (this.pointerLock) {
      this.room.requestPointerLock =
        this.room.requestPointerLock ||
        this.room.mozRequestPointerLock ||
        this.room.webkitRequestPointerLock

      this.addEventListeners()
    }

    document.exitFullscreen =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitCancelFullScreen

    document.exitPointerLock =
      document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock
  }

  update () {
    if (!this.controls.enabled) return

    const time = performance.now()
    const delta = (time - this.prevTime) / 1000

    this.velocity.x -= this.velocity.x * 10 * delta
    this.velocity.z -= this.velocity.z * 10 * delta

    if (this.move.forward) {
      this.velocity.z -= 750 * delta
    }

    if (this.move.backward) {
      this.velocity.z += 500 * delta
    }

    if (this.move.left) {
      this.velocity.x -= 500 * delta
    }

    if (this.move.right) {
      this.velocity.x += 500 * delta
    }

    const position = this.controls.getObject()
    const step = {
      x: this.velocity.x * delta,
      z: this.velocity.z * delta
    }

    position.translateX(step.x)
    position.translateZ(step.z)

    if (this.checkCollision(position)) {
      position.translateX(-step.x)
      position.translateZ(-step.z)
    }

    this.prevTime = time
  }

  checkCollision (current) {
    if (current.position.z < this.borders.front) {
      return true
    }

    if (current.position.z > this.borders.back) {
      return true
    }

    if (current.position.x > this.borders.right) {
      return true
    }

    if (current.position.x < this.borders.left) {
      return true
    }

    return false
  }

  onKeyDown (event) {
    this.keyHandler(event.keyCode, true)
  }

  onKeyUp (event) {
    this.keyHandler(event.keyCode, false)
  }

  keyHandler (code, pressed) {
    switch (code) {
      case 27:
        if (this.lockOnly) {
          this.setFullscreenMode(false)
        }
        break

      case 40:
      case 83:
        this.move.backward = pressed
        break

      case 38:
      case 87:
        this.move.forward = pressed
        break

      case 39:
      case 68:
        this.move.right = pressed
        break

      case 37:
      case 65:
        this.move.left = pressed
        break
    }
  }

  addEventListeners () {
    this._onPointerLockChange = this.onPointerLockChange.bind(this)
    this._onPointerLockError = this.onPointerLockError.bind(this)

    this._onKeyDown = this.onKeyDown.bind(this)
    this._onKeyUp = this.onKeyUp.bind(this)

    document.addEventListener('mozpointerlockchange', this._onPointerLockChange, false)
    document.addEventListener('pointerlockchange', this._onPointerLockChange, false)

    document.addEventListener('webkitpointerlockerror', this._onPointerLockError, false)
    document.addEventListener('mozpointerlockerror', this._onPointerLockError, false)
    document.addEventListener('pointerlockerror', this._onPointerLockError, false)

    document.addEventListener('keydown', this._onKeyDown, false)
    document.addEventListener('keyup', this._onKeyUp, false)
  }

  dispose () {
    document.removeEventListener('mozpointerlockchange', this._onPointerLockChange, false)
    document.removeEventListener('pointerlockchange', this._onPointerLockChange, false)

    document.removeEventListener('webkitpointerlockerror', this._onPointerLockError, false)
    document.removeEventListener('mozpointerlockerror', this._onPointerLockError, false)
    document.removeEventListener('pointerlockerror', this._onPointerLockError, false)

    document.removeEventListener('keydown', this._onKeyDown, false)
    document.removeEventListener('keyup', this._onKeyUp, false)

    this.setFullscreenMode(false)
    this.controls.dispose()
  }

  onPointerLockChange () {
    setTimeout(() => {
      if (!this.isFullscreen() && this._exitFullscreenCallback) {
        this._exitFullscreenCallback()
      }
    }, 100)
  }

  onPointerLockError (event) {
    console.error('\'pointerlockerror\' event occured...', event)

    if (this.lockOnly) {
      this.enable(false)
    }
  }

  enterFullscreenCallback (callback = null) {
    this.goFullscreenCallback = callback
  }

  exitFullscreenCallback (callback = null) {
    this._exitFullscreenCallback = callback
  }

  setBorders (borders) {
    this.borders = borders
  }

  enable (enable) {
    this.controls.enabled = enable && this.activated
    this.enabled = enable && this.activated

    if (this.enabled) {
      this.prevTime = performance.now()
    }
  }

  getCameraDirection () {
    this.direction.normalize()
    return this.controls.getDirection(this.direction)
  }

  setFullscreenMode (fullscreen) {
    this.inFullscreen = fullscreen

    if (fullscreen) {
      this.enable(true)
      this.room.requestPointerLock()
      if (!this.lockOnly) this.room.requestFullscreen()
    } else {
      if (!this.lockOnly) document.exitFullscreen()
      document.exitPointerLock()
      this.enable(false)
    }
  }

  isFullscreen () {
    if (this.lockOnly) return this.isLocked()
    return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen
  }

  isLocked () {
    return !!document.pointerLockElement
  }
}
