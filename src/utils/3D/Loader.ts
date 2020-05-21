// import { MaterialLoader } from '@three/loaders/MaterialLoader'
import { Loader as THREELoader } from '@three/loaders/Loader'
// import { TextureLoader } from '@three/loaders/TextureLoader'
// eslint-disable-next-line no-unused-vars
import { Material } from '@three/materials/Material'
// import { Color } from '@three/math/Color'
// import { _Math } from '@three/math/Math'

export class Loader extends THREELoader {
  public initMaterials (materials: Array<Material>, texturePath: string, crossOrigin: string): Array<Material> {
    const array: Array<Material> = []

    console.log('Loader.initMaterials')

    // for (let m = 0; m < materials.length; m++) {
    //   array[m] = this.createMaterial(materials[m], texturePath, crossOrigin)
    // }

    return array
  }

  // private createMaterial (m: Material, texturePath: string, crossOrigin: string): Material {

  // }
}
