interface ObserverOptions extends IntersectionObserverInit {
  readonly visibleClass?: string
}

export class Observer {
  private observer: IntersectionObserver
  private observerOptions: ObserverOptions
  private onIntersect: IntersectionObserverCallback

  private readonly defaultOptions: ObserverOptions = {
    visibleClass: 'visible',
    rootMargin: '0px',
    threshold: 0.25,
    root: null
  }

  public constructor (options?: ObserverOptions, callback?: IntersectionObserverCallback) {
    this.onIntersect = typeof callback === 'function' ? callback : this.defaultCallback.bind(this)
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
        this.toggleVisible(entry.target)
      } else {
        this.toggleHidden(entry.target)
      }
    }
  }

  private toggleVisible (element: Element): void {
    const visibleClass = this.observerOptions.visibleClass as string
    const visible = element.classList.contains(visibleClass)
    if (!visible) element.classList.add(visibleClass)
  }

  private toggleHidden (element: Element): void {
    const visibleClass = this.observerOptions.visibleClass as string
    const visible = element.classList.contains(visibleClass)
    if (visible) element.classList.remove(visibleClass)
  }

  public unobserve (target: HTMLElement): void {
    this.observer.unobserve(target)
  }

  public observe (target: HTMLElement): void {
    this.observer.observe(target)
  }

  public dispose (): void {
    this.observer.disconnect()
  }
}

export default new Observer()
