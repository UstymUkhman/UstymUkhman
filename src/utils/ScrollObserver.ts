interface ScrollObserverOptions extends IntersectionObserverInit {
  readonly visibleClass?: string
}

export default class {
  private observer: IntersectionObserver
  private observerOptions: ScrollObserverOptions
  private onIntersect: IntersectionObserverCallback

  private readonly defaultOptions: ScrollObserverOptions = {
    visibleClass: 'visible',
    rootMargin: '0px',
    root: undefined,
    threshold: 0
  }

  constructor (callback?: IntersectionObserverCallback, options?: ScrollObserverOptions) {
    this.onIntersect = typeof callback === 'function' ? callback : this.defaultCallback
    this.observerOptions = { ...this.defaultOptions, ...options }

    this.observer = new IntersectionObserver(this.onIntersect, {
      rootMargin: this.observerOptions.rootMargin,
      threshold: this.observerOptions.threshold,
      root: this.observerOptions.root
    })
  }

  private defaultCallback (entries: Array<IntersectionObserverEntry>): void {
    for (let e = 0, length = entries.length; e < length; e++) {
      const entry = entries[e]

      if (entry.isIntersecting) {
        this.isVisible(entry.target)
      }

      /* else {
        this.isHidden(entry.target)
      } */
    }
  }

  private isVisible (element: Element): boolean {
    const visibleClass = this.observerOptions.visibleClass as string
    const visible = !element.classList.contains(visibleClass)

    if (visible) element.classList.add(visibleClass)
    return visible
  }

  // private isHidden (element: Element): void { }

  public dispose (): void {
    delete this.observerOptions
    delete this.onIntersect
    delete this.observer
  }
}
