// import { Vector2 } from '@three/math/Vector2'
// import { Vector3 } from '@three/math/Vector3'
// import { Vector4 } from '@three/math/Vector4'
import { Color } from '@three/math/Color'
import ElColorPicker from 'element-ui/packages/color-picker'
import Vue from 'vue'
Vue.component('ElColorPicker', ElColorPicker)

export default [
  {
    match (object) {
      return object && object.constructor === Color
    },
    getControl (h, model, prop) {
      return <ElColorPicker value={'#' + model[prop].getHexString()} on-change={(value) => { model[prop].set(value) }} />
    }
  }
]
