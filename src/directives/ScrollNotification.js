import Vue from 'vue'

const registry = {}

const scrollContainer = Vue.directive('scroll-container', {
  bind: (element, binding) => {
    const container = element
    const key = binding.arg || 'global'

    if (registry[key] && !registry[key].$data.destroyed) return

    const visibleElement = (element) => {
      if (!element) return true
      const _element = element.getBoundingClientRect()
      const _screen = container.getBoundingClientRect()

      return _element.bottom > (_screen.top + 10) && _element.top < (_screen.bottom - 10)
    }

    element.onScroll = (event) => {
      registry[key].$data.boundElements.forEach((bound) => {
        const visibleClass = binding.value || 'in-view'

        if (visibleElement(bound.element)) {
          bound.element.classList.add(visibleClass)
        } else {
          bound.element.classList.remove(visibleClass)
        }
      })
    }

    registry[key] = new Vue({
      data: () => {
        return {
          boundElements: [],
          destroyed: false
        }
      },

      watch: {
        boundElements: (value) => {
          element.onScroll()
        }
      }
    })

    element.addEventListener('scroll', element.onScroll)
  },

  inserted: (element, binding) => {
    element.onScroll()
  },

  unbind: (element, binding) => {
    const key = binding.arg || 'global'

    element.removeEventListener('scroll', element.onScroll)
    element.onScroll = null

    registry[key].$data.destroyed = true
    registry[key].$destroy()
  }
})

const scrollElement = Vue.directive('scroll-element', {
  inserted: (element, binding) => {
    const key = binding.arg || 'global'

    if (registry[key] && !registry[key].$data.destroyed) {
      registry[key].$data.boundElements.push({element, binding})
    }
  },

  unbind: function (element, binding) {
    const key = binding.arg || 'global'
    let elementIndex = -1

    registry[key].$data.boundElements.forEach((bound, index) => {
      if (bound.el === element) {
        elementIndex = index
      }
    })

    registry[key].$data.boundElements.splice(elementIndex, 1)
  }
})

export {
  scrollContainer as ScrollContainer,
  scrollElement as ScrollElement
}
