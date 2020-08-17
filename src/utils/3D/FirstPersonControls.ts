type PerspectiveCamera = import('@three/cameras/PerspectiveCamera').PerspectiveCamera
import { KeyboardEventListener, Platform } from '@/utils'
import PointerControls from '@/utils/3D/PointerControls'

type Object3D = import('@three/core/Object3D').Object3D
type Scene = import('@three/scenes/Scene').Scene
import { Vector3 } from '@three/math/Vector3'

type FullscreenCallback = () => unknown
const enum Direction { UP, RIGHT, DOWN, LEFT }
type Directions<Type> = { [way in Direction]: Type }
const LOCK_ONLY = Platform.safari || Platform.firefox

export default class FirstPersonControls {
  private readonly onPointerChange: EventListener = this.onPointerLockChange.bind(this)
  private readonly onPointerError: EventListener = this.onPointerLockError.bind(this)

  private readonly onKeyDown: KeyboardEventListener = this.onKeyPress.bind(this)
  private readonly onKeyUp: KeyboardEventListener = this.onKeyRelease.bind(this)

  private velocity: Vector3 = new Vector3()
  private controls: PointerControls
  private camera: PerspectiveCamera
  private room: HTMLCanvasElement
  private scene: Scene

  private pointerLock = this.room.requestPointerLock
  private fullscreen = this.room.requestFullscreen

  public onEnterFullscreen: FullscreenCallback | null = null
  public onExitFullscreen: FullscreenCallback | null = null

  private delta: number = performance.now()
  private activated = false
  private enabled = false
  public error = false

  private borders: Directions<number> = {
    [Direction.UP]: 0,
    [Direction.RIGHT]: 0,
    [Direction.DOWN]: 0,
    [Direction.LEFT]: 0
  }

  private move: Directions<boolean> = {
    [Direction.UP]: false,
    [Direction.RIGHT]: false,
    [Direction.DOWN]: false,
    [Direction.LEFT]: false
  }

  constructor (room: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera) {
    this.room = room
    this.scene = scene
    this.enabled = true
    this.camera = camera

    this.controls = new PointerControls(this.camera, 16)
    this.error = !this.fullscreen || !this.pointerLock
    this.scene.add(this.controls.object)
    this.addEventListeners()
  }

  private addEventListeners (): void {
    document.addEventListener('mozpointerlockchange', this.onPointerChange, false)
    document.addEventListener('pointerlockchange', this.onPointerChange, false)

    document.addEventListener('webkitpointerlockerror', this.onPointerError, false)
    document.addEventListener('mozpointerlockerror', this.onPointerError, false)
    document.addEventListener('pointerlockerror', this.onPointerError, false)

    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  private onPointerLockChange (): void {
    setTimeout(() => {
      if (this.isFullscreen && this.onEnterFullscreen) {
        this.onEnterFullscreen()
      } else if (!this.isFullscreen && this.onExitFullscreen) {
        this.onExitFullscreen()
      }
    }, 100)
  }

  private onPointerLockError (event: Event): void {
    console.error('\'pointerlockerror\' event occured...', event)
    if (LOCK_ONLY) this.enable(false)
  }

  private keyHandler (code: number, pressed: boolean): void {
    switch (code) {
      case 27:
        if (LOCK_ONLY) this.setFullscreenMode(false)
        break

      case 38: case 87:
        this.move[Direction.UP] = pressed
        break

      case 39: case 68:
        this.move[Direction.RIGHT] = pressed
        break

      case 40: case 83:
        this.move[Direction.DOWN] = pressed
        break

      case 37: case 65:
        this.move[Direction.LEFT] = pressed
        break
    }
  }

  private onKeyRelease (event: KeyboardEvent): void {
    this.keyHandler(event.keyCode, false)
  }

  private onKeyPress (event: KeyboardEvent): void {
    this.keyHandler(event.keyCode, true)
  }

  private checkCollision (yaw: Object3D): boolean {
    return (
      yaw.position.z < this.borders[Direction.UP] ||
      yaw.position.x > this.borders[Direction.RIGHT] ||
      yaw.position.z > this.borders[Direction.DOWN] ||
      yaw.position.x < this.borders[Direction.LEFT]
    )
  }

  public setFullscreenMode (fullscreen: boolean): void {
    if (fullscreen) {
      this.enable(true)
      this.room.requestPointerLock()
      if (!LOCK_ONLY) this.room.requestFullscreen()
    } else {
      if (!LOCK_ONLY) {
        setTimeout(() => {
          if (!document.hidden) document.exitFullscreen()
        })
      }

      document.exitPointerLock()
      this.enable(false)
    }
  }

  public setBorders (borders: Directions<number>): void {
    this.borders = borders
  }

  public activate (): void {
    this.activated = true
    if (this.isFullscreen) this.enable(true)
  }

  public enable (enable: boolean): void {
    this.controls.enabled = enable && this.activated
    this.enabled = enable && this.activated

    if (this.enabled) {
      this.delta = performance.now()
    }
  }

  public update (): void {
    if (!this.controls.enabled) return

    const time = performance.now()
    const position = this.controls.object
    const delta = (time - this.delta) / 1000

    this.velocity.x -= this.velocity.x * 10 * delta
    this.velocity.z -= this.velocity.z * 10 * delta

    if (this.move[Direction.UP]) {
      this.velocity.z -= 750 * delta
    }

    if (this.move[Direction.RIGHT]) {
      this.velocity.x += 500 * delta
    }

    if (this.move[Direction.DOWN]) {
      this.velocity.z += 500 * delta
    }

    if (this.move[Direction.LEFT]) {
      this.velocity.x -= 500 * delta
    }

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

    this.delta = time
  }

  public dispose (): void {
    document.removeEventListener('mozpointerlockchange', this.onPointerChange, false)
    document.removeEventListener('pointerlockchange', this.onPointerChange, false)

    document.removeEventListener('webkitpointerlockerror', this.onPointerError, false)
    document.removeEventListener('mozpointerlockerror', this.onPointerError, false)
    document.removeEventListener('pointerlockerror', this.onPointerError, false)

    document.removeEventListener('keydown', this.onKeyDown, false)
    document.removeEventListener('keyup', this.onKeyUp, false)

    this.setFullscreenMode(false)
    this.controls.dispose()

    delete this.onEnterFullscreen
    delete this.onExitFullscreen
    delete this.pointerLock
    delete this.fullscreen

    delete this.velocity
    delete this.controls
    delete this.borders

    delete this.camera
    delete this.scene
    delete this.room
    delete this.move
  }

  public get cameraDirection (): Vector3 {
    return this.controls.direction
  }

  public get isFullscreen (): boolean {
    return LOCK_ONLY ? this.isLocked : document.fullscreen
  }

  private get isLocked (): boolean {
    return !!document.pointerLockElement
  }
}
