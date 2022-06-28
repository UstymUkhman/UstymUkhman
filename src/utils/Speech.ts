import SPEECH from '@/assets/audios/speech.mp3'

const speach: HTMLAudioElement = new Audio(SPEECH)

export const play = (delay: number) => {
  setTimeout(speach.play.bind(speach), delay)
  speach.autoplay = false
  speach.onended = stop

  speach.volume = 0.5
  speach.loop = false
  speach.load()
}

export const stop = () => {
  if (speach) {
    speach.pause()
    speach.currentTime = 0
  }
}
