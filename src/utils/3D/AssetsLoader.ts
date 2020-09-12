import { JSONModel, JSONLoader, JSONPromise } from '@/utils/3D/JSONLoader'
import { LoadingManager } from '@three/loaders/LoadingManager'
import { TextureLoader } from '@three/loaders/TextureLoader'
import { Texture } from '@three/textures/Texture'

type TextureCallback = (asset: Texture) => unknown
type JSONCallback = (asset: JSONModel) => unknown

export default class AssetsLoader extends LoadingManager {
  private readonly texture = new TextureLoader(this)
  private readonly json = new JSONLoader(this)

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

  public async loadTexture (texture: Texture | string, callback?: TextureCallback): Promise<Texture> {
    const asset = (
      this.isTextureType(texture)
        ? await this.parse(this.texture, texture)
        : await this.load(this.texture, texture)
    ) as Texture

    if (callback) callback(asset)
    return asset
  }

  public async loadModel (model: JSON | string, callback?: JSONCallback): Promise<JSONModel> {
    const asset = (
      this.isJSONType(model)
        ? await this.parse(this.json, model)
        : await this.load(this.json, model)
    ) as JSONModel

    if (callback) callback(asset)
    return asset
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private load (loader: TextureLoader | JSONLoader, ...args: any[]): Promise<Texture | JSONModel> {
    return this.execute(loader, 'load', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parse (loader: TextureLoader | JSONLoader, ...args: any[]): Promise<Texture | JSONModel> {
    return this.execute(loader, 'parse', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private execute (loader: TextureLoader | JSONLoader, fn: string, args: any[]): Promise<Texture | JSONModel> {
    return new Promise((resolve, reject) => {
      const onError = (error: Error) => reject(error)
      const onLoad = (result: JSONPromise) => resolve(result)
      const onProgress = (progress: number) => console.log(`Loading... ${progress}%`, progress)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((loader as any)[fn](...args.concat(
        fn === 'load' ? [onLoad, onProgress, onError] : [onLoad, onError]
      )))
    })
  }

  private isTextureType (image: Texture | string): boolean {
    return image instanceof Texture
  }

  private isJSONType (model: JSON | string): boolean {
    return model instanceof Object
  }
}
