// eslint-disable-next-line no-unused-vars
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { Object3D } from '@three/core/Object3D'
import { Vector3 } from '@three/math/Vector3'
import { Euler } from '@three/math/Euler'
import { PI } from '@/utils/Number'

export default class PointerControls {
  private orientation: Vector3 = new Vector3(0, 0, -1)
  private rotation: Euler = new Euler(0, 0, 0, 'YXZ')
  private directionVector: Vector3 = new Vector3()

  private pitch: Object3D = new Object3D()
  private yaw: Object3D = new Object3D()

  private move = this.rotate.bind(this)
  private active: boolean = false

  constructor (camera: PerspectiveCamera, height: number = 10) {
    document.addEventListener('mousemove', this.move, false)
    this.yaw.position.y = height

    this.yaw.add(this.pitch)
    this.pitch.add(camera)
  }

  private rotate (event: MouseEventInit): void {
    if (!this.active) return

    const movementX: number = event.movementX || 0
    const movementY: number = event.movementY || 0

    this.yaw.rotation.y -= movementX * 0.002
    this.pitch.rotation.x -= movementY * 0.002
    this.pitch.rotation.x = Math.max(-PI.d2, Math.min(PI.d2, this.pitch.rotation.x))

    if (this.pitch.rotation.x < -0.5) {
      this.pitch.rotation.x = -0.5
    }
  }

  public get direction (): Vector3 {
    this.rotation.set(this.pitch.rotation.x, this.yaw.rotation.y, 0)
    this.directionVector.copy(this.orientation).applyEuler(this.rotation)
    return this.directionVector
  }

  public set enabled (active: boolean) {
    this.active = active
  }

  public get enabled (): boolean {
    return this.active
  }

  public get object (): Object3D {
    return this.yaw
  }

  public dispose (): void {
    document.removeEventListener('mousemove', this.move, false)
    delete this.directionVector
    delete this.orientation
    delete this.rotation

    this.active = false
    delete this.pitch
    delete this.yaw
  }
}