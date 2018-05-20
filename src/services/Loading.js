import Platform from '@/platform'

export default class Loading {
  static getPageName (item) {
    const routes = ['About', 'Works', 'Contacts']
    const experiments = Platform.ie11 || Platform.mobile

    routes.push(experiments ? 'Experiments' : 'PillChoice')
    this.activeItem = item
    return routes[item]
  }

  static checkActiveItem (reset = false) {
    if (!this.activeItem) this.activeItem = 0
    if (reset) this.activeItem = null
  }

  static getActiveItem () {
    return (this.activeItem === undefined || this.activeItem === null) ? false : this.activeItem
  }
}
