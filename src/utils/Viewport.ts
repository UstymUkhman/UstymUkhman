import { reactive, toRefs } from 'vue'

type ResizeCallback = (screen: Size, videoScreen?: Size) => unknown

export interface Size {
  width: number
  height: number
  ratio: number
}

export class Viewport {
  private readonly root: CSSStyleDeclaration = document.documentElement.style
  private readonly update: EventListener = this.updateSize.bind(this)
  private readonly callback: ResizeCallback | null = null

  private readonly videoScreen: Size = reactive({
    ratio: window.innerWidth / window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth
  })

  private readonly screen: Size = reactive({
    ratio: window.innerWidth / window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth
  })

  constructor (callback?: ResizeCallback) {
    window.addEventListener('resize', this.update)
    this.update(new CustomEvent('resize'))
    this.callback = callback || null
  }

  private updateSize (): void {
    let height = window.innerHeight
    let width = window.innerWidth

    if (window.innerWidth > window.innerHeight) {
      height = window.innerWidth / 16 * 9
    } else {
      width = window.innerHeight / 9 * 16
    }

    this.videoScreen.width = width
    this.videoScreen.height = height
    this.videoScreen.ratio = width / height

    this.screen.width = window.innerWidth
    this.screen.height = window.innerHeight
    this.screen.ratio = window.innerWidth / window.innerHeight

    this.root.setProperty('--width', `${window.innerWidth}px`)
    this.root.setProperty('--height', `${window.innerHeight}px`)

    if (this.callback) {
      this.callback(this.screen, this.videoScreen)
    }
  }

  public dispose (): void {
    window.removeEventListener('resize', this.update)
  }

  public get videoSize (): Size {
    const videoSize = toRefs(this.videoScreen)

    return {
      width: videoSize.width.value,
      height: videoSize.height.value,
      ratio: videoSize.ratio.value
    }
  }

  public get size (): Size {
    const size = toRefs(this.screen)

    return {
      width: size.width.value,
      height: size.height.value,
      ratio: size.ratio.value
    }
  }
}
