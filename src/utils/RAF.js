/**
 *
 *
 * @class RAF
 */
class RAF {
  /**
   * Creates an instance of RAF.
   *
   * @memberOf RAF
   */
  constructor () {
    this.listeners = []
    this._update = this._update.bind(this)
    this._update()
  }
  /**
   *
   *
   * @param {any} listener
   *
   * @memberOf RAF
   */
  add (listener) {
    let index = this.listeners.indexOf(listener)
    if (index === -1) {
      this.listeners.push(listener)
    }
  }
  /**
   *
   *
   * @param {any} listener
   *
   * @memberOf RAF
   */
  remove (listener) {
    let index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }
  /**
   *
   *
   *
   * @memberOf RAF
   */
  _update () {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i]()
    }
    window.requestAnimationFrame(this._update)
  }
}

export default new RAF()
