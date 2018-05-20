import RAF from './RAF'
require('@hughsk/fulltilt/dist/fulltilt')

class Gyroscope {
  constructor () {
    this.orientationX = 0
    this.orientationY = 0
    this.enabled = true
    this._update = this._update.bind(this)
    RAF.add(this._update)
  }

  _update () {
    let fulltiltPromise = new window.FULLTILT.getDeviceOrientation({ 'type': 'game' }) // eslint-disable-line new-cap

    fulltiltPromise.then((deviceOrientation) => {
      let euler = deviceOrientation.getScreenAdjustedEuler()

      this.orientationX = euler.beta
      this.orientationY = euler.gamma

      if (this.orientationX > 90) {
        this.orientationY = -this.orientationY
      }
      // console.log(this.orientationX, this.orientationY)
    }).catch((message) => {
      console.warn('Disabling Gyroscope, reason:', message)
      this.enabled = false
      RAF.remove(this._update)
    })
  }
}

export default new Gyroscope()
