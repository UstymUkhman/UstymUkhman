class RAF {
  constructor () {
    this.update = this.update.bind(this)
    this.listeners = []
    this.frame = null
    this.update()
  }

  add (listener) {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener)
    }
  }

  update () {
    this.listeners.forEach((listener) => { listener() })
    this.frame = requestAnimationFrame(this.update)
  }

  remove (listener) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) this.listeners.splice(index, 1)
    if (!this.listeners.length) this.cancel()
  }

  cancel () {
    cancelAnimationFrame(this.frame)
    this.listeners = []
  }
}

export default new RAF()
