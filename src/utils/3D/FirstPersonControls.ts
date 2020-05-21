/* eslint-disable no-unused-vars */
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { KeyboardEventListener, Platform } from '@/utils'
import PointerControls from '@/utils/3D/PointerControls'
import { Object3D } from '@three/core/Object3D'
import { Vector3 } from '@three/math/Vector3'
import { Scene } from '@three/scenes/Scene'
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
const enum Directions { UP, RIGHT, DOWN, LEFT }
type Direction<Type> = { [direction in Directions]: Type }

const LOCK_ONLY = Platform.safari || Platform.edge || Platform.firefox

export default class FirstPersonControls {
  private readonly onPointerChange: EventListener = this.onPointerLockChange.bind(this)
  private readonly onPointerError: EventListener = this.onPointerLockError.bind(this)

  private readonly onKeyDown: KeyboardEventListener = this.onKeyPress.bind(this)
  private readonly onKeyUp: KeyboardEventListener = this.onKeyRelease.bind(this)

  private readonly direction: Vector3 = new Vector3()
  private readonly velocity: Vector3 = new Vector3()

  private readonly controls: PointerControls
  private readonly camera: PerspectiveCamera
  private readonly room: HTMLCanvasElement
  private readonly scene: Scene

  private readonly pointerLock = this.room.requestPointerLock
  private readonly fullscreen = this.room.requestFullscreen

  public onEnterFullscreen: Function | null = null
  public onExitFullscreen: Function | null = null

  private prevTime: number = performance.now()
  private inFullscreen: boolean = false
  private activated: boolean = false
  private enabled: boolean = false
  public error: boolean = false

  private readonly move: Direction<boolean> = {
    [Directions.UP]: false,
    [Directions.RIGHT]: false,
    [Directions.DOWN]: false,
    [Directions.LEFT]: false
  }

  private borders: Direction<number> = {
    [Directions.UP]: 0,
    [Directions.RIGHT]: 0,
    [Directions.DOWN]: 0,
    [Directions.LEFT]: 0
  }

  constructor (room: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera) {
    this.room = room
    this.scene = scene
    this.enabled = true
    this.camera = camera

    this.controls = new PointerControls(this.camera, 16)
    this.error = !this.fullscreen || !this.pointerLock
    this.scene.add(this.controls.object)
    // this.setExperimentalAPIs()
    this.addEventListeners()
  }

  /* private setExperimentalAPIs (): void {
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
  } */

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
      if (!this.isFullscreen && this.onExitFullscreen) {
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
        this.move[Directions.UP] = pressed
        break

      case 39: case 68:
        this.move[Directions.RIGHT] = pressed
        break

      case 40: case 83:
        this.move[Directions.DOWN] = pressed
        break

      case 37: case 65:
        this.move[Directions.LEFT] = pressed
        break
    }
  }

  private onKeyRelease (event: KeyboardEvent): void {
    this.keyHandler(event.keyCode, false)
  }

  private onKeyPress (event: KeyboardEvent): void {
    this.keyHandler(event.keyCode, true)
  }

  private setFullscreenMode (fullscreen: boolean): void {
    this.inFullscreen = fullscreen

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

  /* private checkCollision (current: Object3D): boolean {
    return (
      current.position.z < this.borders[Directions.UP] ||
      current.position.x > this.borders[Directions.RIGHT] ||
      current.position.z > this.borders[Directions.DOWN] ||
      current.position.x < this.borders[Directions.LEFT]
    )
  } */

  public setBorders (borders: Direction<number>) {
    this.borders = borders
  }

  public activate (): void {
    this.activated = true
    if (this.isFullscreen) this.enable(true)
  }

  private enable (enable: boolean): void {
    this.controls.enabled = enable && this.activated
    this.enabled = enable && this.activated

    if (this.enabled) {
      this.prevTime = performance.now()
    }
  }

  private get isFullscreen (): boolean {
    if (LOCK_ONLY) return this.isLocked
    return document.fullscreen // || document.mozFullScreen || document.webkitIsFullScreen
  }

  private get isLocked (): boolean {
    return !!document.pointerLockElement
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
  }
}
