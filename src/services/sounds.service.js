export class SoundsService {
  playMusic() {
    // this.music = new Audio('assets/music.mp3');
    // this.music.autoplay = true;
    // this.music.volume = 0.05;
    // this.music.loop = true;
    // this.music.load();
  }

  playSpeach() {
    this.speach = new Audio('assets/speech.wav');
    this.speach.autoplay = true;
    this.speach.loop = false;
    this.speach.volume = 1;
    this.speach.onended = this.endSpeach.bind(this);

    // this.music.pause();
    this.speach.load();
  }

  endSpeach() {
    this.speach.pause();
    this.speach = null;
    // this.music.play();
  }
}
