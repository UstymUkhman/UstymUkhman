type PerspectiveCamera = import('@three/cameras/PerspectiveCamera').PerspectiveCamera
type Object3D = import('@three/core/Object3D').Object3D
type Scene = import('@three/scenes/Scene').Scene

import PointerControls from '@/utils/3D/PointerControls'
import { Vector3 } from '@three/math/Vector3'

export const enum Direction { UP, RIGHT, DOWN, LEFT }
type Directions<Type> = { [way in Direction]: Type }
type EventCallback = () => void

export class FirstPersonControls {
  private readonly onPointerChange = this.onPointerLockChange.bind(this)
  private readonly onPointerError = this.onPointerLockError.bind(this)

  private readonly onKeyDown = this.onKeyPress.bind(this)
  private readonly onKeyUp = this.onKeyRelease.bind(this)

  public onPointerUnlock?: EventCallback
  public onPointerLock?: EventCallback

  private controls: PointerControls
  private delta = performance.now()
  private velocity = new Vector3()

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

  constructor (scene: Scene, camera: PerspectiveCamera) {
    this.controls = new PointerControls(camera, 16)
    scene.add(this.controls.object)
    this.addEventListeners()
    this.enabled = true
  }

  private addEventListeners (): void {
    document.addEventListener('webkitpointerlockchange', this.onPointerChange, false)
    document.addEventListener('mozpointerlockchange', this.onPointerChange, false)
    document.addEventListener('pointerlockchange', this.onPointerChange, false)

    document.addEventListener('webkitpointerlockerror', this.onPointerError, false)
    document.addEventListener('mozpointerlockerror', this.onPointerError, false)
    document.addEventListener('pointerlockerror', this.onPointerError, false)

    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  private onPointerLockChange (): void {
    this.isLocked
      ? this.onPointerLock && this.onPointerLock()
      : this.onPointerUnlock && this.onPointerUnlock()
  }

  private onPointerLockError (event: Event): void {
    console.error('\'pointerlockerror\' event occured...', event)
    document.exitPointerLock()
    this.enable = false
  }

  private keyHandler (code: string, pressed: boolean): void {
    switch (code) {
      case 'Escape':
        this.pointerLock = false
        break

      case 'ArrowUp': case 'KeyW':
        this.move[Direction.UP] = pressed
        break

      case 'ArrowRight': case 'KeyD':
        this.move[Direction.RIGHT] = pressed
        break

      case 'ArrowDown': case 'KeyS':
        this.move[Direction.DOWN] = pressed
        break

      case 'ArrowLeft': case 'KeyA':
        this.move[Direction.LEFT] = pressed
        break
    }
  }

  private onKeyRelease (event: KeyboardEvent): void {
    this.keyHandler(event.code, false)
  }

  private onKeyPress (event: KeyboardEvent): void {
    this.keyHandler(event.code, true)
  }

  private checkCollision (yaw: Object3D): boolean {
    return (
      yaw.position.z < this.borders[Direction.UP] ||
      yaw.position.x > this.borders[Direction.RIGHT] ||
      yaw.position.z > this.borders[Direction.DOWN] ||
      yaw.position.x < this.borders[Direction.LEFT]
    )
  }

  public setBorders (borders: Directions<number>): void {
    this.borders = borders
  }

  public activate (): void {
    this.activated = true
    if (this.isLocked) this.enable = true
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

    delete this.onPointerUnlock
    delete this.onPointerLock

    this.pointerLock = false
    this.controls.dispose()
  }

  public set pointerLock (lock: boolean) {
    lock ? document.body.requestPointerLock() : document.exitPointerLock()
    this.enable = lock
  }

  public set enable (enable: boolean) {
    this.controls.enabled = enable && this.activated
    this.enabled = enable && this.activated

    if (this.enabled) {
      this.delta = performance.now()
    }
  }

  public get cameraDirection (): Vector3 {
    return this.controls.direction
  }

  public get isLocked (): boolean {
    return !!document.pointerLockElement
  }
}
