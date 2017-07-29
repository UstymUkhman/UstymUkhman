export class SoundsService {
  constructor() {
    this.reduceInterval = null;
    this.raiseInterval  = null;

    this.music = new Audio('assets/audio/music.mp3');
    this.music.autoplay = false;
    this.music.volume = 0.05;
    this.music.loop = true;
    this.music.load();

    this.speach = new Audio('assets/audio/speech.mp3');
    this.speach.autoplay = false;
    this.speach.loop = false;
    this.speach.volume = 1;
    this.speach.onended = this.endSpeach.bind(this);
    this.speach.load();

    this.open = new Audio('assets/audio/opened.mp3');
    this.open.autoplay = false;
    this.open.loop = false;
    this.open.volume = 1;
    this.open.load();

    this.close = new Audio('assets/audio/closed.mp3');
    this.close.autoplay = false;
    this.close.loop = false;
    this.close.volume = 1;
    this.close.load();
  }

  playMusic() {
    this.music.play();
  }

  playSpeach() {
    if (this.music) {
      this.reduceInterval = setInterval(this.reduceMusicVolume.bind(this), 500);
    }
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
      this.speach.currentTime = 0;

      this.music.play();
      this.raiseInterval = setInterval(this.raiseMusicVolume.bind(this), 500);
    }
  }

  openedDoor() {
    this.open.play();
  }

  closedDoor() {
    this.close.play();
  }
}
