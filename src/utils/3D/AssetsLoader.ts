import { JSONModel, JSONLoader, JSONPromise } from '@/utils/3D/JSONLoader'
import { LoadingManager } from '@three/loaders/LoadingManager'

type LoadCallback = (asset: JSONModel) => unknown

export default class AssetsLoader extends LoadingManager {
  private readonly Base64 = /data:image\/([a-zA-Z]*);base64,([^"]*)/
  private readonly IMAGE = /^\.|\.bmp|\.jpg$|\.gif$|.png$|.gif$/

  public onStart = (): void => {
    console.info('Loading... 0%')
  }

  public onProgress = (url: string, loaded: number, total: number): void => {
    const progress = (loaded * 100 / total).toFixed()
    console.info(`Loading... ${progress}%`)
  }

  public onError = (url: string): void => {
    console.info(`Error occurred loading ${url}.`)
  }

  public async loadJSON (loader: JSONLoader, model: JSON | string, callback?: LoadCallback): Promise<JSONModel> {
    const asset: JSONModel = this.isJSONType(model)
      ? await this.parse(loader, model)
      : await this.load(loader, model)

    if (callback) callback(asset)
    return asset
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private load (loader: JSONLoader, ...args: any[]): Promise<JSONModel> {
    return this.execute(loader, 'load', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parse (loader: JSONLoader, ...args: any[]): Promise<JSONModel> {
    return this.execute(loader, 'parse', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private execute (loader: JSONLoader, fn: string, args: any[]): Promise<JSONModel> {
    return new Promise((resolve, reject) => {
      const onError = (error: Error) => reject(error)
      const onLoad = (result: JSONPromise) => resolve(result)
      const onProgress = (progress: number) => console.log(`Loading... ${progress}%`, progress)

      const loaderCallbacks = fn === 'load' ? [onLoad, onProgress, onError] : [onLoad, onError]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((loader as any)[fn](...args.concat(loaderCallbacks)))
    })
  }

  private isImageType (asset: string): boolean {
    return this.IMAGE.test(asset) || this.Base64.test(asset)
  }

  private isJSONType (model: JSON | string): boolean {
    return model instanceof Object
  }
}
