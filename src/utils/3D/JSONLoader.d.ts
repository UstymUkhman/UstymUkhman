import { Geometry } from '@three/core/Geometry'
import { Material } from '@three/materials/Material'
import { LoadingManager } from '@three/loaders/LoadingManager'

export type JSONPromise = PromiseLike<JSONModel> | undefined
export type JSONModel = { geometry: Geometry, materials?: Array<Material> }

export class JSONLoader {
  private crossOrigin: string
  private resourcePath: string

  constructor(manager?: LoadingManager)

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
