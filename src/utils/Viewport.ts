// import { onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'

const videoViewPort = {
  height: window.innerHeight,
  width: window.innerWidth
}

const viewPort = {
  height: window.innerHeight,
  width: window.innerWidth
}

/* const updateViewPort = (): void => {
  let height = window.innerHeight
  let width = window.innerWidth

  if (window.innerWidth > window.innerHeight) {
    height = window.innerWidth / 16 * 9
  } else {
    width = window.innerHeight / 9 * 16
  }

  viewPort.height = window.innerHeight
  viewPort.width = window.innerWidth

  videoViewPort.height = height
  videoViewPort.width = width
}

const remove = (): void => {
  window.removeEventListener('resize', updateViewPort)
}

const add = (): void => {
  window.addEventListener('resize', updateViewPort)
  updateViewPort()
}

onMounted(add)
onActivated(add)
onDeactivated(remove)
onBeforeUnmount(remove) */

export { viewPort, videoViewPort }
