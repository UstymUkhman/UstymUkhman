export class LoadingService {
  constructor() {
    this.pages = [
      'about'   ,
      'works'   ,
      'contact' ,
      'more'
    ];
  }

  canActivate() {
    return this.loaded || false;
  }

  finishLoading() {
    this.loaded = true;

    if (window.location.hash === '#/') {
      window.location.href += '.';
    }
  }

  setActivePage(item) {
    this.activeItem = item;
    window.location.href += this.pages[item];
  }

  getLastItem() {
    return this.activeItem || null;
  }

  loadPillChoice(choice) {
    if (choice)
      window.location.href = window.location.href.replace('more', 'rabbit-hole');
    else
      this.backToMenu();
  }

  backToMenu() {
    window.history.back();
  }
}
