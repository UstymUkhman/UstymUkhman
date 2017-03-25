export class LoadingService {
  canActivate() {
    return this.loaded || false;
  }

  finishLoading() {
    this.loaded = true;
    window.location.href += '.';
  }
}
