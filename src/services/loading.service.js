export class LoadingService {
  canActivate() {
    return this.loaded || false;
  }

  finishLoading() {
    this.loaded = true;

    if (window.location.hash === '#/') {
      window.location.href += '.';
    }
  }

  setActiveItem(item) {
    this.activeItem = item;
  }

  getLastItem() {
    return this.activeItem || null;
  }

  loadPillChoice(choice) {
    if (!choice)
      window.location.href += '.';
    else
      window.location.href = window.location.href.replace('more', 'rabbit-hole');
  }
}
