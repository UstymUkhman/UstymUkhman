export class SoundsService {
  playMusic() {
    this.music = new Audio('assets/audio/music.mp3');
    this.music.autoplay = true;
    this.music.volume = 0.05;
    this.music.loop = true;
    this.music.load();
  }

  playSpeach() {
    this.speach = new Audio('assets/audio/speech.wav');
    this.speach.autoplay = false;
    this.speach.loop = false;
    this.speach.volume = 1;
    this.speach.onended = this.endSpeach.bind(this);

    if (this.music) {
      this.reduceInterval = setInterval(this.reduceMusicVolume.bind(this), 500);
    }

    this.speach.load();
  }

  reduceMusicVolume() {
    if (this.music.volume > 0.01) {
      this.music.volume -= 0.01;
    } else {
      clearInterval(this.reduceInterval);
      this.music.pause();
      this.speach.play();
    }
  }

  raiseMusicVolume() {
    if (this.music.volume < 0.05) {
      this.music.volume += 0.005;
    } else {
      clearInterval(this.raiseInterval);
    }
  }

  endSpeach() {
    if (this.speach) {
      this.speach.pause();
      this.speach = null;

      if (!this.music) {
        this.playMusic();
      }

      this.music.play();
      this.raiseInterval = setInterval(this.raiseMusicVolume.bind(this), 500);
    }
  }
}
