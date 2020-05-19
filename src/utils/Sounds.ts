export default class Sounds {
  private static speach: HTMLAudioElement;
  private static close: HTMLAudioElement;
  private static open: HTMLAudioElement;
  private static closePlay: number = 0;

  public static playSpeach (): void {
    this.speach = new Audio('public/audio/speech.mp3')
    this.speach.onended = this.endSpeach.bind(this)
    this.speach.autoplay = false
    this.speach.loop = false
    this.speach.volume = 1
    this.speach.load()
    this.speach.play()
  }

  public static endSpeach (): void {
    if (this.speach) {
      this.speach.pause()
      delete this.speach
    }
  }

  public static openedDoor (): void {
    this.open = new Audio('public/audio/opened.mp3')
    this.open.autoplay = true
    this.open.loop = false
    this.open.volume = 1
    this.open.load()
  }

  public static closedDoor (): void {
    const playEnd = this.closePlay ? (this.closePlay + 800) : 0
    const now = Date.now()

    if (now > playEnd) {
      this.close = new Audio('public/audio/closed.mp3')
      this.closePlay = Date.now()
      this.close.autoplay = true
      this.close.loop = false
      this.close.volume = 1
      this.close.load()
    }
  }
}
