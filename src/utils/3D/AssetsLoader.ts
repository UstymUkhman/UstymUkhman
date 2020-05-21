// eslint-disable-next-line no-unused-vars
import { JSONModel, JSONLoader } from '@/utils/3D/JSONLoader'
import { LoadingManager } from '@three/loaders/LoadingManager'

type PromiseResult = PromiseLike<JSONModel> | undefined

export default class AssetsLoader extends LoadingManager {
  private readonly Base64 = /data:image\/([a-zA-Z]*);base64,([^"]*)/
  private readonly IMAGE = /^\.|\.bmp|\.jpg$|\.gif$|.png$|.gif$/

  public onStart = (url: string, loaded: number, total: number): void => {
    console.info('Loading... 0%')
  }

  public onProgress = (url: string, loaded: number, total: number): void => {
    const progress = (loaded * 100 / total).toFixed()
    console.info(`Loading... ${progress}%`)
  }

  public onError = (url: string): void => {
    console.info(`Error occurred loading ${url}.`)
  }

  public onLoad = (): void => { }

  public async loadJSON (loader: JSONLoader, model: JSON | string, callback?: Function): Promise<JSONModel> {
    const asset: JSONModel = this.isJSONType(model)
      ? await this.parse(loader, model)
      : await this.load(loader, model)

    if (callback) { callback(asset) }
    return asset
  }

  private load (loader: JSONLoader, ...args: any[]): Promise<JSONModel> {
    return this.execute.call(null, loader, 'load', args)
  }

  private parse (loader: JSONLoader, ...args: any[]): Promise<JSONModel> {
    return this.execute.call(null, loader, 'parse', args)
  }

  private execute (loader: any, fn: string, args: any[]): Promise<JSONModel> {
    return new Promise((resolve, reject) => {
      const onError: Function = (error: Error) => { reject(error) }
      const onLoad: Function = (result: PromiseResult) => { resolve(result) }
      const onProgress: Function = (progress: number) => { console.log(`Loading... ${progress}%`, progress) }

      const loaderCallbacks = fn === 'load' ? [onLoad, onProgress, onError] : [onLoad, onError]
      resolve(loader[fn].apply(loader, args.concat(loaderCallbacks)))
    })
  }

  private isImageType (asset: string): boolean {
    return this.IMAGE.test(asset) || this.Base64.test(asset)
  }

  private isJSONType (model: JSON | string): boolean {
    return model instanceof Object
  }
}
