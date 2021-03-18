type PerspectiveCamera = import('three/src/cameras/PerspectiveCamera').PerspectiveCamera

import { Object3D } from 'three/src/core/Object3D'
import { Vector3 } from 'three/src/math/Vector3'
import { Euler } from 'three/src/math/Euler'
import { PI } from '@/utils/Number'

export default class PointerControls {
  private rotation = new Euler(0, 0, 0, 'YXZ')
  private orientation = new Vector3(0, 0, -1)
  private directionVector = new Vector3()

  private move = this.rotate.bind(this)
  private pitch = new Object3D()
  private yaw = new Object3D()
  private active = false

  public constructor (camera: PerspectiveCamera, height = 10) {
    document.addEventListener('mousemove', this.move, false)
    this.yaw.position.y = height

    this.yaw.add(this.pitch)
    this.pitch.add(camera)
  }

  private rotate (event: MouseEventInit): void {
    if (!this.active) return

    const movementX = event.movementX || 0
    const movementY = event.movementY || 0

    this.yaw.rotation.y -= movementX * 0.002
    this.pitch.rotation.x -= movementY * 0.002
    this.pitch.rotation.x = Math.max(-PI.d2, Math.min(PI.d2, this.pitch.rotation.x))

    if (this.pitch.rotation.x < -0.5) {
      this.pitch.rotation.x = -0.5
    }
  }

  public dispose (): void {
    document.removeEventListener('mousemove', this.move, false)
    this.active = false
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
}
