import { MaterialLoader } from '@three/loaders/MaterialLoader'
import { Loader as THREELoader } from '@three/loaders/Loader'
import { TextureLoader } from '@three/loaders/TextureLoader'

// eslint-disable-next-line no-unused-vars
import { Material } from '@three/materials/Material'
import { MathUtils } from '@three/math/MathUtils'
import { Color } from '@three/math/Color'

import {
  MirroredRepeatWrapping,
  SubtractiveBlending,
  MultiplyBlending,
  AdditiveBlending,
  RepeatWrapping,
  CustomBlending,
  NormalBlending,
  NoBlending,
  DoubleSide,
  BackSide
} from '@three/constants'

type Blending = {
  [key: string]: number
}

/* class LoadersHandler {
  private static loaders: Array<THREELoader | RegExp> = []

  public static add (regex: RegExp, loader: THREELoader): void {
    this.loaders.push(regex, loader)
  }

  public static get (file: string): THREELoader | Loader | null {
    for (let i = 0, l = this.loaders.length; i < l; i += 2) {
      const loader = this.loaders[i + 1] as THREELoader
      const regex = this.loaders[i] as RegExp
      if (regex.test(file)) return loader
    }

    return null
  }
} */

export class Loader extends THREELoader {
  private static readonly materialLoader: MaterialLoader = new MaterialLoader()
  private static readonly textureLoader: TextureLoader = new TextureLoader()
  private static readonly color: Color = new Color()

  private static readonly textures: any = { }
  private static readonly VertexColors = 2
  private static readonly FaceColors = 1

  private static texturePath: string = ''
  private static crossOrigin: string = ''

  private static readonly BlendingMode: Blending = {
    SubtractiveBlending: SubtractiveBlending,
    MultiplyBlending: MultiplyBlending,
    AdditiveBlending: AdditiveBlending,
    CustomBlending: CustomBlending,
    NormalBlending: NormalBlending,
    NoBlending: NoBlending
  }

  public static initMaterials (materials: Array<Material>, texturePath: string, crossOrigin: string): Array<Material> {
    const array: Array<Material> = []

    this.texturePath = texturePath
    this.crossOrigin = crossOrigin

    for (let i = 0; i < materials.length; ++i) {
      array[i] = this.createMaterial(materials[i])
    }

    return array
  }

  private static createMaterial (material: any): Material {
    const json: any = {
      uuid: MathUtils.generateUUID(),
      type: 'MeshLambertMaterial'
    }

    for (const name in material) {
      const value = material[name]

      switch (name) {
        case 'DbgColor':
        case 'DbgIndex':
        case 'opticalDensity':
        case 'illumination':
          break

        case 'DbgName':
          json.name = value
          break

        case 'blending':
          json.blending = this.BlendingMode[value]
          break

        case 'colorAmbient':
        case 'mapAmbient':
          console.warn('Loader.createMaterial:', name, 'is no longer supported.')
          break

        case 'colorDiffuse':
          json.color = this.color.fromArray(value).getHex()
          break

        case 'colorSpecular':
          json.specular = this.color.fromArray(value).getHex()
          break

        case 'colorEmissive':
          json.emissive = this.color.fromArray(value).getHex()
          break

        case 'specularCoef':
          json.shininess = value
          break

        case 'shading':
          if (value.toLowerCase() === 'basic') json.type = 'MeshBasicMaterial'
          if (value.toLowerCase() === 'phong') json.type = 'MeshPhongMaterial'
          if (value.toLowerCase() === 'standard') json.type = 'MeshStandardMaterial'
          break

        case 'mapDiffuse':
          json.map = this.loadTexture(
            value, material.mapDiffuseRepeat, material.mapDiffuseOffset,
            material.mapDiffuseWrap, material.mapDiffuseAnisotropy
          )
          break

        case 'mapDiffuseRepeat':
        case 'mapDiffuseOffset':
        case 'mapDiffuseWrap':
        case 'mapDiffuseAnisotropy':
          break

        case 'mapEmissive':
          json.emissiveMap = this.loadTexture(
            value, material.mapEmissiveRepeat, material.mapEmissiveOffset,
            material.mapEmissiveWrap, material.mapEmissiveAnisotropy
          )
          break

        case 'mapEmissiveRepeat':
        case 'mapEmissiveOffset':
        case 'mapEmissiveWrap':
        case 'mapEmissiveAnisotropy':
          break
        case 'mapLight':
          json.lightMap = this.loadTexture(
            value, material.mapLightRepeat, material.mapLightOffset,
            material.mapLightWrap, material.mapLightAnisotropy
          )
          break

        case 'mapLightRepeat':
        case 'mapLightOffset':
        case 'mapLightWrap':
        case 'mapLightAnisotropy':
          break

        case 'mapAO':
          json.aoMap = this.loadTexture(
            value, material.mapAORepeat, material.mapAOOffset,
            material.mapAOWrap, material.mapAOAnisotropy
          )
          break

        case 'mapAORepeat':
        case 'mapAOOffset':
        case 'mapAOWrap':
        case 'mapAOAnisotropy':
          break

        case 'mapBump':
          json.bumpMap = this.loadTexture(
            value, material.mapBumpRepeat, material.mapBumpOffset,
            material.mapBumpWrap, material.mapBumpAnisotropy
          )
          break

        case 'mapBumpScale':
          json.bumpScale = value
          break

        case 'mapBumpRepeat':
        case 'mapBumpOffset':
        case 'mapBumpWrap':
        case 'mapBumpAnisotropy':
          break

        case 'mapNormal':
          json.normalMap = this.loadTexture(
            value, material.mapNormalRepeat, material.mapNormalOffset,
            material.mapNormalWrap, material.mapNormalAnisotropy
          )
          break

        case 'mapNormalFactor':
          json.normalScale = value
          break

        case 'mapNormalRepeat':
        case 'mapNormalOffset':
        case 'mapNormalWrap':
        case 'mapNormalAnisotropy':
          break

        case 'mapSpecular':
          json.specularMap = this.loadTexture(
            value, material.mapSpecularRepeat, material.mapSpecularOffset,
            material.mapSpecularWrap, material.mapSpecularAnisotropy
          )
          break

        case 'mapSpecularRepeat':
        case 'mapSpecularOffset':
        case 'mapSpecularWrap':
        case 'mapSpecularAnisotropy':
          break

        case 'mapMetalness':
          json.metalnessMap = this.loadTexture(
            value, material.mapMetalnessRepeat, material.mapMetalnessOffset,
            material.mapMetalnessWrap, material.mapMetalnessAnisotropy
          )
          break

        case 'mapMetalnessRepeat':
        case 'mapMetalnessOffset':
        case 'mapMetalnessWrap':
        case 'mapMetalnessAnisotropy':
          break

        case 'mapRoughness':
          json.roughnessMap = this.loadTexture(
            value, material.mapRoughnessRepeat, material.mapRoughnessOffset,
            material.mapRoughnessWrap, material.mapRoughnessAnisotropy
          )
          break

        case 'mapRoughnessRepeat':
        case 'mapRoughnessOffset':
        case 'mapRoughnessWrap':
        case 'mapRoughnessAnisotropy':
          break

        case 'mapAlpha':
          json.alphaMap = this.loadTexture(
            value, material.mapAlphaRepeat, material.mapAlphaOffset,
            material.mapAlphaWrap, material.mapAlphaAnisotropy
          )
          break

        case 'mapAlphaRepeat':
        case 'mapAlphaOffset':
        case 'mapAlphaWrap':
        case 'mapAlphaAnisotropy':
          break

        case 'flipSided':
          json.side = BackSide
          break

        case 'doubleSided':
          json.side = DoubleSide
          break

        case 'transparency':
          console.warn('Loader.createMaterial: transparency has been renamed to opacity')
          json.opacity = value
          break

        case 'depthTest':
        case 'depthWrite':
        case 'colorWrite':
        case 'opacity':
        case 'reflectivity':
        case 'transparent':
        case 'visible':
        case 'wireframe':
          json[name] = value
          break

        case 'vertexColors':
          if (value === 'face') json.vertexColors = this.FaceColors
          if (value === true) json.vertexColors = this.VertexColors
          break

        default:
          console.error('Loader.createMaterial: Unsupported', name, value)
          break
      }
    }

    if (json.type === 'MeshBasicMaterial') delete json.emissive
    if (json.type !== 'MeshPhongMaterial') delete json.specular

    if (json.opacity < 1) json.transparent = true

    this.materialLoader.setTextures(this.textures)
    return this.materialLoader.parse(json)
  }

  private static loadTexture (path: string, repeat: Array<number>, offset: Array<number>, wrap: Array<string>, anisotropy: number): string {
    const fullPath = this.texturePath + path
    // const loader = LoadersHandler.get(fullPath)

    const texture = /* loader ? await loader.loadAsync(fullPath) : */ (() => {
      this.textureLoader.setCrossOrigin(this.crossOrigin)
      return this.textureLoader.load(fullPath)
    })()

    if (repeat !== undefined) {
      texture.repeat.fromArray(repeat)
      if (repeat[0] !== 1) texture.wrapS = RepeatWrapping
      if (repeat[1] !== 1) texture.wrapT = RepeatWrapping
    }

    if (offset !== undefined) {
      texture.offset.fromArray(offset)
    }

    if (wrap !== undefined) {
      if (wrap[0] === 'repeat') texture.wrapS = RepeatWrapping
      if (wrap[0] === 'mirror') texture.wrapS = MirroredRepeatWrapping

      if (wrap[1] === 'repeat') texture.wrapT = RepeatWrapping
      if (wrap[1] === 'mirror') texture.wrapT = MirroredRepeatWrapping
    }

    if (anisotropy !== undefined) {
      texture.anisotropy = anisotropy
    }

    const uuid = MathUtils.generateUUID()
    this.textures[uuid] = texture
    return uuid
  }
}
