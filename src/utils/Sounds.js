export default class Sounds {
  static playMusic () {
    if (this.music === undefined) {
      this.music = new Audio('static/audio/music.mp3')
      this.music.autoplay = this.speach === undefined
      this.music.volume = 0.05
      this.music.loop = true
      this.music.load()
    }
  }

  static stopMusic () {
    if (this.music) {
      this._reduce = setInterval(() => {
        if (this.music.volume > 0.01) {
          this.music.volume -= 0.01
        } else {
          clearInterval(this._reduce)
          this.music.pause()
          this.music = undefined
        }
      }, 500)
    }
  }

  static playSpeach () {
    this.speach = new Audio('static/audio/speech.mp3')
    this.speach.onended = this.endSpeach.bind(this)
    this.speach.autoplay = false
    this.speach.loop = false
    this.speach.volume = 1
    this.speach.load()

    if (this.music) {
      this._reduce = setInterval(() => {
        if (this.music.volume > 0.01) {
          this.music.volume -= 0.01
        } else {
          clearInterval(this._reduce)
          this.music.pause()
          this.speach.play()
        }
      }, 500)
    } else {
      this.speach.play()
    }
  }

  static endSpeach (playMusic) {
    playMusic = !!playMusic
    this.speach = undefined

    if (playMusic) {
      this.playMusic()
      this.music.play()

      this._raise = setInterval(() => {
        if (this.music.volume < 0.05) {
          this.music.volume += 0.005
        } else {
          clearInterval(this._raise)
        }
      }, 500)
    }
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
