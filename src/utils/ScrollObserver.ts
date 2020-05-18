interface IntersectionObserverOptions extends IntersectionObserverInit {
  visibleClass?: string
}

export default class {
  private observer: IntersectionObserver
  private onIntersect: IntersectionObserverCallback
  private observerOptions: IntersectionObserverOptions

  private readonly defaultOptions: IntersectionObserverOptions = {
    visibleClass: 'visible',
    rootMargin: '0px',
    root: undefined,
    threshold: 0
  }

  constructor (callback?: IntersectionObserverCallback, options?: IntersectionObserverOptions) {
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
        this.isVisible(entry.target, entry)
      } else {
        this.isHidden(entry.target, entry)
      }
    }
  }

  private isVisible (element: Element, entry: IntersectionObserverEntry): boolean {
    const visibleClass = this.observerOptions.visibleClass as string
    const visible = !element.classList.contains(visibleClass)

    if (visible) element.classList.add(visibleClass)
    return visible
  }

  private isHidden (element: Element, entry: IntersectionObserverEntry): void { }

  public dispose (): void {
    delete this.observerOptions
    delete this.onIntersect
    delete this.observer
  }
}
