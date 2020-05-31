import { Sounds, Platform } from '@/utils'

export default class Loading {
  private static readonly routes = ['About', 'Works', 'Contacts']
  private static activeItem: number | undefined;

  public static getPageName (item: number): string {
    const experiments = Platform.isIE || Platform.mobile

    this.routes.push(experiments ? 'Experiments' : 'More')
    this.activeItem = item

    if (item === 3 && !experiments) {
      setTimeout(Sounds.playSpeach.bind(Sounds), 500)
    }

    return this.routes[item]
  }

  public static checkActiveItem (reset = false): void {
    if (!this.activeItem) this.activeItem = 0
    if (reset) this.activeItem = undefined
  }

  public static setActiveItem (item: number): void {
    this.activeItem = item
  }

  public static getActiveItem (): boolean | number {
    return this.activeItem ?? false ?? this.activeItem
  }
}
