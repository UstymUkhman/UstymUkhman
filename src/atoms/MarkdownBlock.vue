<script>
import { getTemplate } from '@/utils/MarkdownParser'
import Vue from 'vue'
export default {
  functional: true,

  props: {
    // the text to be displayed formatted in markdown
    text: {
      type: String,
      required: true,
      default: ''
    },
    // decides wether block tags are rendered or not, example:
    // ## input ##
    // some paragraph
    //
    // some other paragraph
    // ## output with true ##
    // <span>
    //   <p>some paragraph</p>
    //   <p>some other paragraph</p>
    // </span>
    // ## output with false ##
    // <span>some paragraph some other paragraph</span>
    inline: {
      type: Boolean,
      default: true
    },
    // the base root tag of this element, can be any tag (div, span, p, etc)
    tag: {
      type: String,
      default: 'span'
    }
  },

  render: function (createElement, context) {
    let t = getTemplate(context.props.text, context.props.inline, context.props.tag)
    let compiled = Vue.compile(t)

    // create a new scope for the compiled markdown template
    let scope = {
      _c: context.parent._c,
      _v: context.parent._v,
      _m: context.parent._m,
      _staticTrees: [],
      _renderProxy: context.parent._renderProxy,
      $options: {
        staticRenderFns: compiled.staticRenderFns
      }
    }

    return createElement({ name: 'MarkdownBlock', render: compiled.render.bind(scope) }, context.data)
  }
}
</script>
