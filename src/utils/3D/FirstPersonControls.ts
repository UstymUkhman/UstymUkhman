type PerspectiveCamera = import('three/src/cameras/PerspectiveCamera').PerspectiveCamera
type AudioListener = import('three/src/audio/AudioListener').AudioListener
type Object3D = import('three/src/core/Object3D').Object3D
type Scene = import('three/src/scenes/Scene').Scene

import { PositionalAudio } from 'three/src/audio/PositionalAudio'
import PointerControls from '@/utils/3D/PointerControls'
import { Vector3 } from 'three/src/math/Vector3'

export const enum Direction { UP, RIGHT, DOWN, LEFT }
type Directions<Type> = { [way in Direction]: Type }
type EventCallback = () => void

export class FirstPersonControls {
  private readonly onPointerChange = this.onPointerLockChange.bind(this)
  private readonly onPointerError = this.onPointerLockError.bind(this)

  private readonly onKeyDown = this.onKeyPress.bind(this)
  private readonly onKeyUp = this.onKeyRelease.bind(this)

  private borders: Directions<number> = [0, 0, 0, 0]
  private readonly move: Directions<boolean> = [
    false, false, false, false
  ]

  public onPointerUnlock?: EventCallback
  public onPointerLock?: EventCallback

  private controls: PointerControls
  private delta = performance.now()
  private velocity = new Vector3()

  private step!: PositionalAudio
  private stepInterval = 0.0

  private activated = false
  private enabled = false
  private blocked = false
  public error = false

  public constructor (scene: Scene, camera: PerspectiveCamera) {
    this.controls = new PointerControls(camera, 16)
    scene.add(this.controls.object)
    this.addEventListeners()
    this.enabled = true
  }

  private stopWalking (): void {
    (this.move as unknown as Array<boolean>).fill(false)
    clearInterval(this.stepInterval)
    this.velocity.setScalar(0.0)
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
    !this.isLocked && this.onPointerUnlock && this.onPointerUnlock()
    console.error('PointerLock error occured:', event)
    document.exitPointerLock()
    this.enable = false
    this.stopWalking()
  }

  private keyHandler (key: string, pressed: boolean): void {
    switch (key) {
      case 'Escape':
        this.pointerLock = false
        break

      case 'ArrowUp':
      case 'W': case 'w':
        this.move[Direction.UP] = pressed
        break

      case 'ArrowRight':
      case 'D': case 'd':
        this.move[Direction.RIGHT] = pressed
        break

      case 'ArrowDown':
      case 'S': case 's':
        this.move[Direction.DOWN] = pressed
        break

      case 'ArrowLeft':
      case 'A': case 'a':
        this.move[Direction.LEFT] = pressed
        break
    }
  }

  private onKeyRelease (event: KeyboardEvent): void {
    if (this.activated && this.isMoving) {
      this.playStepSound(false)
    }

    this.keyHandler(event.key, false)

    if (!this.isMoving) {
      clearInterval(this.stepInterval)
      this.stepInterval = 0.0
    }
  }

  private onKeyPress (event: KeyboardEvent): void {
    this.keyHandler(event.key, true)

    if (this.activated && this.isMoving && !this.stepInterval) {
      this.playStepSound()

      this.stepInterval = setInterval(() =>
        this.isMoving && this.playStepSound()
      , 500)
    }
  }

  private playStepSound (press = true): void {
    const volume = +press * 2 + 1
    !press && this.step.stop()

    if (this.step.isPlaying || this.blocked) return
    this.step.setVolume(volume)
    this.step.play()
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

  public setStepSound (sound: AudioBuffer, listener: AudioListener): void {
    const { y } = this.controls.object.position
    this.step = new PositionalAudio(listener)
    this.controls.object.add(this.step)
    this.step.setBuffer(sound)
    this.step.position.y = -y
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

    const x = this.velocity.x * delta
    const z = this.velocity.z * delta

    position.translateX(x)
    position.translateZ(z)

    this.blocked = this.checkCollision(position)

    if (this.blocked) {
      position.translateX(-x)
      position.translateZ(-z)

      if (!this.isMoving) {
        this.velocity.x *= -0.1
        this.velocity.z *= -0.1
      }
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
    if (!lock) this.stopWalking()
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

  private get isMoving (): boolean {
    return (this.move as unknown as Array<boolean>).includes(true)
  }

  public get isLocked (): boolean {
    return !!document.pointerLockElement
  }
}
