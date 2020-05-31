import { reactive, toRefs } from 'vue'

export type ResizeCallback = (screen: Size, videoScreen?: Size) => unknown

export interface Size {
  height: number
  width: number
}

export class Viewport {
  private readonly root: CSSStyleDeclaration = document.documentElement.style
  private readonly update: EventListener = this.updateSize.bind(this)
  private readonly callback: ResizeCallback | null = null

  private readonly videoScreen: Size = reactive({
    height: window.innerHeight,
    width: window.innerWidth
  })

  private readonly screen: Size = reactive({
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

    this.root.setProperty('--height', `${window.innerHeight}px`)
    this.root.setProperty('--width', `${window.innerWidth}px`)

    this.screen.height = window.innerHeight
    this.screen.width = window.innerWidth

    this.videoScreen.height = height
    this.videoScreen.width = width

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
      height: videoSize.height.value,
      width: videoSize.width.value
    }
  }

  public get size (): Size {
    const size = toRefs(this.screen)

    return {
      height: size.height.value,
      width: size.width.value
    }
  }
}
