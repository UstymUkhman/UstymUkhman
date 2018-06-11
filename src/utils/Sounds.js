export default class Sounds {
  static playSpeach () {
    this.speach = new Audio('static/audio/speech.mp3')
    this.speach.onended = this.endSpeach.bind(this)
    this.speach.autoplay = false
    this.speach.loop = false
    this.speach.volume = 1

    this.speach.load()
    this.speach.play()
  }

  static endSpeach () {
    this.speach.pause()
    delete this.speach
  }

  static openedDoor () {
    this.open = new Audio('static/audio/opened.mp3')
    this.open.autoplay = true
    this.open.loop = false
    this.open.volume = 1
    this.open.load()
  }

  static closedDoor () {
    const playEnd = this._closePlay ? (this._closePlay + 800) : null
    const now = Date.now()

    if (now > playEnd) {
      this.close = new Audio('static/audio/closed.mp3')
      this._closePlay = Date.now()
      this.close.autoplay = true
      this.close.loop = false
      this.close.volume = 1
      this.close.load()
    }
  }
}
