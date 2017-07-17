export class LoadingService {
  constructor() {
    this.activeItem = null;

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
    return this.activeItem;
  }

  loadPillChoice(choice) {
    if (choice)
      window.location.href = window.location.href.replace('more', 'rabbit-hole');
    else
      this.backToMenu();
  }

  loadExperiment(experiment) {
    // window.location.href = `${window.location.origin}/experiments/${experiment}`;
    window.location.href = experiment;
  }

  backToMenu(reset = false) {
    if (!this.activeItem) this.activeItem = 0;
    if (reset) this.activeItem = null;

    window.location.hash = '#/';
  }
}
