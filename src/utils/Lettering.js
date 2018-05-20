export default class Lettering {
  animate (message, slowTyping = 0, callback, timeout = 1000) {
    if (!message) return

    this.slowly = slowTyping
    this.nextTiming = null
    this.message = message
    this.letters = []
    this.index = 0

    this.hasCallback = typeof callback === 'function'
    this.word = this.message.textContent.split('')

    if (!this.word.length) return

    if (this.hasCallback) {
      this.callback = callback
      this.timeout = timeout
    }

    this._getLetters()

    while (this.message.firstChild) {
      this.message.removeChild(this.message.firstChild)
    }

    this.lastLetter = this.letters[this.letters.length - 1]
    this.letteringID = requestAnimationFrame(this._lettersAnimation.bind(this))
  }

  skipLettering () {
    if (!this.letters) return
    this._stopLettering()

    for (let i = this.index; i < this.letters.length;) {
      this._showLetter(this.letters[i])
      this.index = ++i
    }

    if (this.hasCallback) {
      setTimeout(this.callback, this.timeout)
    }
  }

  getAnimationFrameID () {
    return this.letteringID
  }

  _getLetters () {
    this.word.forEach((char) => {
      if (char === '#') {
        this.letters.push(document.createElement('br'))
        return
      }

      const letter = document.createElement('span')
      letter.textContent = char

      if (char === '%') {
        letter.style.marginLeft = '50px'
        letter.textContent = ''
      }

      this.letters.push(letter)
    })
  }

  _lettersAnimation () {
    if (!this.letters[this.index]) return
    const typeLetter = Date.now() >= this.nextTiming

    if (!this.slowly || (this.slowly && typeLetter)) {
      this._showLetter(this.letters[this.index++])
      this.nextTiming = Date.now() + this.slowly
    }

    if (this.last === this.lastLetter) {
      this._stopLettering()

      if (this.hasCallback) {
        setTimeout(this.callback, this.timeout)
      }

      return
    }

    this.letteringID = requestAnimationFrame(this._lettersAnimation.bind(this))
  }

  _showLetter (letter) {
    letter.style.visibility = 'visible'
    this.message.appendChild(letter)
    this.last = letter
  }

  _stopLettering () {
    cancelAnimationFrame(this.letteringID)
  }
}
