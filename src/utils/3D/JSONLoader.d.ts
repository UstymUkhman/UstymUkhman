type Material = import('three/src/materials/Material').Material
type BufferGeometry = import('three/src/core/BufferGeometry').BufferGeometry
type LoadingManager = import('three/src/loaders/LoadingManager').LoadingManager

export type JSONModel = { geometry: BufferGeometry, materials?: Array<Material> }
export type JSONPromise = PromiseLike<JSONModel> | undefined

export class JSONLoader {
  private crossOrigin: string
  private resourcePath: string

  public constructor(manager?: LoadingManager)

  public load: (
    url: string,
    onLoad: (result: JSONPromise) => void,
    onProgress: (progress: number) => void,
    onError: (error: Error) => void
  ) => void

  public setPath: (value: string) => JSONLoader
  public setCrossOrigin: (value: string) => JSONLoader
  public setResourcePath: (value: string) => JSONLoader
  public parse: () => (json: JSON, path: string) => JSONModel
}
