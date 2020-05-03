class RAF {
  private animate: Function = this.update.bind(this)
  private listeners: Function[] = []
  private frame: number = 0

  constructor () {
    this.animate()
  }

  public add (listener: Function): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener)
    }
  }

  private update (): void {
    this.listeners.forEach((listener) => { listener() })
    this.frame = requestAnimationFrame(this.update)
  }

  public remove (listener: Function): void {
    const index = this.listeners.indexOf(listener)
    if (index > -1) this.listeners.splice(index, 1)
    if (!this.listeners.length) this.dispose()
  }

  public dispose (): void {
    cancelAnimationFrame(this.frame)
    this.listeners = []
  }
}

export default new RAF()
