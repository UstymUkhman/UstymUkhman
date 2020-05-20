import { LoadingManager } from '@three/loaders/LoadingManager'
import { Material } from '@three/materials/Material'
import { Geometry } from '@three/core/Geometry'

export type JSONModel = { geometry: Geometry, materials?: Array<Material> }

export class JSONLoader {
  private crossOrigin: string
  private resourcePath: string

  constructor(manager?: LoadingManager)

  public load: (url: string, onLoad: Function, onProgress: Function, onError: Function) => void

  public setPath: (value: string) => JSONLoader
  public setCrossOrigin: (value: string) => JSONLoader
  public setResourcePath: (value: string) => JSONLoader

  public parse: () => (json: JSON, path: string) => JSONModel
}
