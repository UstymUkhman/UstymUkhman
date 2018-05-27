import to from 'await-to-js'

const _execute = (loader, fn, wait, ...args) => {
  return new Promise((resolve, reject) => {
    const onProgress = (progress) => {}

    const onComplete = (result) => {
      resolve(result)
    }

    const onError = (error) => {
      reject(error)
    }

    const loaderCallbacks = fn === 'load' ? [onComplete, onProgress, onError] : [onComplete, onError]
    const object = loader[fn].apply(loader, args.concat(loaderCallbacks))

    if (!wait) {
      resolve(object)
    }
  })
}

// const _load = (loader, wait, ...args) => {
//   return _execute.apply(null, [loader, 'load', wait].concat(args))
// }

const _parse = (loader, wait, ...args) => {
  return _execute.apply(null, [loader, 'parse', wait].concat(args))
}

const _loadAsset = async (loader, object, wait) => {
  return new Promise(async (resolve, reject) => {
    let asset, error

    if (object.constructor.name === 'Promise') {
      [error, asset] = await to(object)

      if (error) {
        reject(error)
        return
      }

      asset = asset.default
    } else {
      asset = object
    }

    [error, asset] = await to(_parse(loader, wait, asset))

    if (error) {
      reject(error)
      return
    }

    resolve(asset)
  })
}

const load = async (loader, object, callback, wait = true) => {
  return new Promise(async (resolve, reject) => {
    let error, asset

    [error, asset] = await to(_loadAsset(loader, object, wait))

    if (error) {
      reject(error)
      return
    }

    if (typeof callback === 'function') {
      callback(asset)
    }

    resolve(asset)
  })
}

export default load
