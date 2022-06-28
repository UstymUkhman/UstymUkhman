import { JSONModel, JSONLoader, JSONPromise } from '@/utils/3D/JSONLoader'
import { LoadingManager } from 'three/src/loaders/LoadingManager'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { AudioLoader } from 'three/src/loaders/AudioLoader'
import { Texture } from 'three/src/textures/Texture'

type Loader = TextureLoader | JSONLoader | AudioLoader
type AudioCallback = (asset: AudioBuffer) => unknown
type TextureCallback = (asset: Texture) => unknown
type JSONCallback = (asset: JSONModel) => unknown
type Asset = Texture | JSONModel | AudioBuffer

export default class AssetsLoader extends LoadingManager {
  private readonly texture = new TextureLoader(this)
  private readonly audio = new AudioLoader(this)
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

  public async loadAudio (audio: string, callback?: AudioCallback): Promise<AudioBuffer> {
    const asset = await new Promise((resolve, reject) => {
      const onError = (error: ErrorEvent) => reject(error)
      const onLoad = (result: AudioBuffer) => resolve(result)

      const onProgress = (progress: ProgressEvent) =>
        console.log(`Loading... ${progress.loaded * 100 / progress.total}%`)

      this.audio.load(audio, onLoad, onProgress, onError)
    }) as AudioBuffer

    if (callback) callback(asset)
    return asset
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private load (loader: Loader, ...args: any[]): Promise<Asset> {
    return this.execute(loader, 'load', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parse (loader: Loader, ...args: any[]): Promise<Asset> {
    return this.execute(loader, 'parse', args)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private execute (loader: Loader, fn: string, args: any[]): Promise<Asset> {
    return new Promise((resolve, reject) => {
      const onError = (error: Error) => reject(error)
      const onLoad = (result: JSONPromise) => resolve(result as Promise<Asset>)
      const onProgress = (progress: number) => console.log(`Loading... ${progress}%`)

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
