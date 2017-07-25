export class LetteringService {
  animate(message, slowTyping = 0, callback, timeout = 1000) {
    if (!message) return;

    this.index       = 0;
    this.letters     = [];
    this.nextTiming  = null;
    this.message     = message;
    this.slowly      = slowTyping;

    this.hasCallback = typeof callback === 'function';
    this.word        = this.message.textContent.split('');

    if (!this.word.length) return;

    if (this.hasCallback) {
      this.callback = callback;
      this.timeout  = timeout;
    }

    this.getLetters();

    while(this.message.firstChild) {
      this.message.removeChild(this.message.firstChild);
    }

    this.lastLetter  = this.letters[this.letters.length - 1];
    this.letteringID = requestAnimationFrame(this.lettersAnimation.bind(this));
  }

  getLetters() {
    this.word.forEach((char) => {
      if (char === '#') {
        this.letters.push(document.createElement('br'));
        return;
      }

      let letter = document.createElement('span');
      letter.textContent = char;

      if (char === '%') {
        letter.style.marginLeft = '50px';
        letter.textContent = '';
      }

      this.letters.push(letter);
    });
  }

  showLetter(letter) {
    letter.style.visibility = 'visible';
    this.message.appendChild(letter);
    this.last = letter;
  }

  lettersAnimation() {
    if (!this.letters[this.index]) return;
    let typeLetter = Date.now() >= this.nextTiming;

    if (!this.slowly || (this.slowly && typeLetter)) {
      this.showLetter(this.letters[this.index++]);
      this.nextTiming = Date.now() + this.slowly;
    }

    if (this.last === this.lastLetter) {
      this.stopLettering();

      if (this.hasCallback) {
        setTimeout(this.callback, this.timeout);
      }

      return;
    }

    this.letteringID = requestAnimationFrame(this.lettersAnimation.bind(this));
  }

  skipLettering() {
    if (!this.letters) return;

    this.stopLettering();

    for (let i = this.index; i < this.letters.length;) {
      this.showLetter(this.letters[i]);
      this.index = ++i;
    }

    if (this.hasCallback) {
      setTimeout(this.callback, this.timeout);
    }
  }

  stopLettering() {
    cancelAnimationFrame(this.letteringID);
  }

  getAnimationFrameID() {
    return this.letteringID;
  }
}
