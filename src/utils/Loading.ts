import { Sounds } from '@/utils'

export default class Loading {
  private static readonly menu = ['About', 'Works', 'Contacts', 'More']
  private static item = -1

  public static getPageName (item: number): string {
    if (item === 3) {
      setTimeout(Sounds.playSpeach.bind(Sounds), 500)
    }

    this.activeItem = item
    return this.menu[item]
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
