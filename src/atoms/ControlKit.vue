<script>
import 'element-ui/lib/theme-chalk/index.css'
import ElForm from 'element-ui/packages/form'
import ElInput from 'element-ui/packages/input'
import ElFormItem from 'element-ui/packages/form-item'
import ElCheckbox from 'element-ui/packages/checkbox'
import ElCollapse from 'element-ui/packages/collapse'
import ElCollapseItem from 'element-ui/packages/collapse-item'
import ElButton from 'element-ui/packages/button'

import { isPlainObject } from '@/utils/ObjectUtils'

export default {
  name: 'ControlKit',

  components: {
    ElForm,
    ElFormItem,
    ElCheckbox,
    ElCollapse,
    ElInput,
    ElCollapseItem,
    ElButton
  },

  props: {
    model: {
      required: true
    },
    target: {
      required: false
    },
    additionalControls: {
      type: Array,
      required: false
    },
    title: {
      type: String,
      required: false,
      default: 'Options'
    },
    sliderRanges: {
      required: false,
      default: function () {
        return {
          'alpha': [0, 1],
          'threshold': [0, 1],
          'radius': [0, 10],
          'exposure': [0, 20],
          'whitepoint': [0, 20]
        }
      }
    }
  },

  methods: {
    sentenceCase: function (text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },

    getNumberSlider: function (h, target, prop) {
      let val = target[prop]
      let min = -10
      let max = 10
      let step = '0.001'

      for (let p in this.sliderRanges) {
        if (prop.toLowerCase().indexOf(p.toLowerCase()) !== -1) {
          min = this.sliderRanges[p][0]
          max = this.sliderRanges[p][1]
        }
      }

      return (
        <div class="number-slider-container">
          <input
            class="number-slider"
            type="range"
            min={min}
            max={max}
            step={parseFloat(step)}
            value={val}
            on-input={function (e) { target[prop] = e.target.value }}
          />
          <input
            class="number-input"
            value={val}
            on-change={function (e) { target[prop] = e.target.value }}
          />
        </div>
      )
    },

    parseModel: function (h, model, output, title = 'Options', target, path = 'model') {
      let children = []
      for (let prop in model) {
        switch (typeof model[prop]) {
          case 'string':
            children.push(
              <ElFormItem label={this.sentenceCase(prop)} label-width="120px">
                <ElInput value={target[prop]} on-change={(value) => { target[prop] = value }} />
              </ElFormItem>
            )
            break
          case 'boolean':
            children.push(
              <ElFormItem label={this.sentenceCase(prop)} label-width="120px">
                <ElCheckbox value={target[prop]} on-change={(value) => { target[prop] = value }} />
              </ElFormItem>
            )
            break
          case 'number':
            children.push(
              <ElFormItem label={this.sentenceCase(prop)} label-width="120px">
                {this.getNumberSlider(h, target, prop)}
              </ElFormItem>
            )
            break
          case 'function':
            children.push(
              <ElFormItem label-width="120px">
                <ElButton on-click={target[prop] ? target[prop] : model[prop]}>{this.sentenceCase(prop)}</ElButton>
              </ElFormItem>
            )
            break
          case 'object':
            if (isPlainObject(model[prop])) {
              this.parseModel(h, model[prop], children, prop, target[prop], path + '.' + prop)
            } else {
              if (this.additionalControls) {
                for (let i = 0; i < this.additionalControls.length; i++) {
                  let controls = this.additionalControls[i]
                  for (let j = 0; j < controls.length; j++) {
                    if (controls[j].match(model[prop])) {
                      children.push(
                        <ElFormItem label={this.sentenceCase(prop)} label-width="120px">
                          {controls[j].getControl(h, model, prop)}
                        </ElFormItem>
                      )
                      break
                    }
                  }
                }
              }
            }
            break
        }
      }
      output.push(<ElCollapseItem title={this.sentenceCase(title)}>{children}</ElCollapseItem>)
    }
  },

  render (h) {
    // console.log('new render triggered')
    let elements = []
    this.parseModel(h, this.model, elements, this.title, this.target ? this.target : this.model, this.target ? 'target' : 'model')
    // this.parseModel(h, this.test, elements, 'Options', this.test, 'test')
    return (
      <div class="control-panel">
        <ElCollapse><ElForm label-position="right" size="mini">{elements}</ElForm></ElCollapse>
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';

.control-panel {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 350px;
  max-height: 100%;

  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;

  background: $c-white;
  border-radius: 0 0 5px 5px;

  font-size: 11px;
}

.number-slider-container {
  width: 100%;
  position: relative;
  height: 28px;

  .number-input {
    width: 40px;
    font-size: 11px;
    top: -10px;
  }

  .number-slider {
    // top: 10px;
  }
  .number-slider,
  .number-input {
    position: relative;
    height: 28px;
    display: inline-block;
    padding: 0;
    margin: 0;
    margin-right: 10px;
  }
}

/* stylelint-disable */
/deep/ .el-collapse-item__header,
/deep/ .el-collapse-item__arrow {
  height: 36px;
  line-height: 36px;
  font-size: 11px;
}

/deep/ .el-form-item__label {
  line-height: 26px;
  font-size: 11px;
}

/deep/ .el-form-item--mini.el-form-item {
  margin-bottom: 4px;
}

/deep/ .el-collapse-item__wrap {
  width: 100%;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 10px;
}
/* stylelint-enable */
</style>
