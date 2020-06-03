import { Sounds, Platform } from '@/utils'

export default class Loading {
  private static readonly routes = ['About', 'Works', 'Contacts']
  private static item = -1

  public static getPageName (item: number): string {
    const experiments = Platform.isIE || Platform.mobile

    this.routes.push(experiments ? 'Experiments' : 'More')
    this.item = item

    if (item === 3 && !experiments) {
      setTimeout(Sounds.playSpeach.bind(Sounds), 500)
    }

    return this.routes[item]
  }

  public static checkActiveItem (reset = false): void {
    if (this.item < 1) this.item = 0
    if (reset) this.item = -1
  }

  public static set activeItem (item: number) {
    this.item = item
  }

  public static get activeItem (): number {
    return this.item < 1 ? 0 : this.item
  }
}
