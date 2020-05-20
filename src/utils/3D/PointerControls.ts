// eslint-disable-next-line no-unused-vars
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera'
import { Object3D } from '@three/core/Object3D'
import { Vector3 } from '@three/math/Vector3'
import { Euler } from '@three/math/Euler'
import { PI } from '@/utils/Number'

export default class PointerControls {
  private readonly rotation: Euler = new Euler(0, 0, 0, 'YXZ')
  private readonly direction: Vector3 = new Vector3(0, 0, -1)

  private readonly pitchObject: Object3D = new Object3D()
  private readonly yawObject: Object3D = new Object3D()

  private readonly move = this.rotate.bind(this)
  private active: boolean = false

  constructor (camera: PerspectiveCamera, height: number = 10) {
    this.pitchObject.add(camera)
    this.yawObject.position.y = height
    this.yawObject.add(this.pitchObject)
    document.addEventListener('mousemove', this.move, false)
  }

  private rotate (event: MouseEventInit): void {
    if (!this.active) return

    const movementX: number = event.movementX || 0
    const movementY: number = event.movementY || 0

    this.yawObject.rotation.y -= movementX * 0.002
    this.pitchObject.rotation.x -= movementY * 0.002
    this.pitchObject.rotation.x = Math.max(-PI.d2, Math.min(PI.d2, this.pitchObject.rotation.x))

    if (this.pitchObject.rotation.x < -0.5) {
      this.pitchObject.rotation.x = -0.5
    }
  }

  public getDirection (way: Vector3): Vector3 {
    this.rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0)
    way.copy(this.direction).applyEuler(this.rotation)
    return way
  }

  public dispose (): void {
    document.removeEventListener('mousemove', this.move, false)
    this.active = false
  }

  public get object (): Object3D {
    return this.yawObject
  }

  public get enabled (): boolean {
    return this.active
  }
}
