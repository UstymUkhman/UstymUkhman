import ElasticVector3 from '@/3d/utils/ElasticVector3'
import ElasticVector2 from '@/3d/utils/ElasticVector2'
import ElasticNumber from '@/utils/ElasticNumber'
import { Vector2 } from '@three/math/Vector2'
import { Vector3 } from '@three/math/Vector3'
/*
 * TODO: documentation
 *
 *
 *
 *
 *
 */
export default class ElasticCameraController {
  constructor ({camera, width, height, sensitivity, thetaMax, thetaMin, phiMax, phiMin, radiusMin, radiusMax, radius, target}) {
    this._camera = camera
    this.width = width || 800
    this.height = height || 600

    this.sensitivity = sensitivity || 10
    this.mouseEnabled = true
    this.enabled = true
    this.thetaMax = thetaMax || 0.8
    this.thetaMin = thetaMin || -0.8
    this.phiMax = phiMax || Number.POSITIVE_INFINITY
    this.phiMin = phiMin || Number.NEGATIVE_INFINITY
    this.radiusMin = radiusMin || 0
    this.radiusMax = radiusMax || Number.POSITIVE_INFINITY

    this._mousePosition = new Vector2(0, 0)
    this._radius = new ElasticNumber(radius || 20)
    this._target = new ElasticVector3(target || new Vector3(0, 0, 0))
    this._phiTheta = new ElasticVector2(new Vector2(0, 0))
    this._phiThetaDownPosition = new Vector2(0, 0)
    this._mouseDownPosition = new Vector2(0, 0)
    this._mousePickingPosition = new Vector2(0, 0)
    this._isMouseDown = false
  }

  set radius (value) {
    this._radius.target = Math.max(this.radiusMin, Math.min(this.radiusMax, value))
  }

  get radius () {
    return this._radius.target
  }

  get target () {
    return this._target
  }

  set target (value) {
    return this._target.copy(value)
  }

  get phi () {
    return this._phiTheta.x
  }
  set phi (value) {
    this._phiTheta.x = value
  }
  get theta () {
    return this._phiTheta.y
  }
  set theta (value) {
    this._phiTheta.y = value
  }

  onMouseMove (event) {
    this._updateMousePosition(event)
  }

  onMouseDown (event) {
    this._isMouseDown = true
    this._updateMousePosition(event)
    this._mouseDownPosition.copy(this._mousePosition)
    this._phiThetaDownPosition.copy(this._phiTheta)
  }

  onMouseUp (event) {
    this._isMouseDown = false
  }

  _getMousePositionX (event) {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].pageX - event.touches[0].target.offsetLeft
    }
    return event.offsetX
  }

  _getMousePositionY (event) {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].pageY - event.touches[0].target.offsetTop
    }
    return event.offsetY
  }

  _updateMousePosition (event) {
    this._mousePosition.x = this._getMousePositionX(event)
    this._mousePosition.y = this._getMousePositionY(event)

    this._mousePickingPosition.x = (this._mousePosition.x / this.width) * 2 - 1
    this._mousePickingPosition.y = -(this._mousePosition.y / this.height) * 2 + 1
  }

  update (delta) {
    this._target.update(delta)
    this._phiTheta.update(delta)
    this._radius.update(delta)

    if (this._isMouseDown && this.mouseEnabled) {
      let mouseDeltaX = this._mouseDownPosition.x - this._mousePosition.x
      let sensitivityScaleX = this.width / this.sensitivity
      this._phiTheta.x = this._phiThetaDownPosition.x + mouseDeltaX / sensitivityScaleX

      let mouseDeltaY = this._mouseDownPosition.y - this._mousePosition.y
      let sensitivityScaleY = this.height / this.sensitivity
      this._phiTheta.y = this._phiThetaDownPosition.y + mouseDeltaY / sensitivityScaleY
    }

    if (isNaN(this._phiTheta.x)) this._phiTheta.x = 0
    if (isNaN(this._phiTheta.y)) this._phiTheta.y = 0

    this._phiTheta.x = Math.max(this.phiMin, Math.min(this.phiMax, this._phiTheta.x))
    this._phiTheta.y = Math.max(this.thetaMin, Math.min(this.thetaMax, this._phiTheta.y))

    if (this.enabled) {
      this._camera.position.z = this._target.value.z + this._radius.value * Math.sin(this._phiTheta.value.y + (Math.PI / 2)) * Math.cos(this._phiTheta.value.x)
      this._camera.position.x = this._target.value.x + this._radius.value * Math.sin(this._phiTheta.value.y + (Math.PI / 2)) * Math.sin(this._phiTheta.value.x)
      this._camera.position.y = this._target.value.y + this._radius.value * Math.cos(this._phiTheta.value.y + (Math.PI / 2))
      this._camera.lookAt(this._target.value)
    }
  }
}
