<template>
  <article itemtype="http://schema.org/WebPageElement" itemscope class="image-drawer-js-page">
    <input ref="image" type="file" accept="image/*" @change="onChange" />

    <div ref="container" class="image-container">
      <img :src="imageSrc" />
    </div>

    <div class="code-container" :class="{ 'object': objectStyle, 'callback': drawSettings.callbackFn, 'pencil': drawSettings.pencil, 'hidden': !visibleCode}">
      <div @click="hideCode" class="close-button-container">
        <div class="close-button left"></div>
        <div class="close-button right"></div>
      </div>

      <code class="code-preview">
        $(<span class="string">'div#image-container'</span>).drawImage({<br>
        &emsp;duration: <span v-html="duration" :class="{'number': !drawSettings.object && !drawSettings.array}"></span><br>
        &emsp;background: <span class="string">'<span>{{drawSettings.background}}</span>'</span>

        <transition appear name="code">
          <span v-if="callback.length || pencil.length" class="coma">,</span>
        </transition>

        <transition appear :name="callbackAnimation">
          <span v-if="callback.length" v-html="callback" class="callback-function"></span>
        </transition>

        <transition appear name="code">
          <span v-if="callbackComa" class="coma">,</span>
        </transition>

        <transition appear name="code">
          <span v-if="pencil.length" v-html="pencil" class="pencil-options"></span>
        </transition>

        <br>});
      </code>
    </div>
  </article>
</template>

<script>
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'
import { removeDatGui } from '@/utils/utilities'

import * as dat from 'dat.gui'
import jquery from 'jquery'

export default {
  name: 'ImageDrawerJS',

  mixins: [FirePrerenderEvent],

  data () {
    return {
      imageDrawerCss: '/static/css/imagedrawer.min.css',
      imageDrawerJs: '/static/js/imagedrawer.min.js',
      imagePencil: '/static/img/pencil.png',
      imageSrc: '/static/img/share.jpg',

      reader: new FileReader(),
      callbackAnimation: '',
      durationTimeout: null,
      optionTimeout: null,
      duration: '30,',

      callbackComa: false,
      visibleCode: false,
      objectStyle: false,
      activeDraw: true,

      callback: '',
      pencil: '',
      gui: null,

      drawSettings: {
        uploadImage: () => {
          this.$refs.image.click()
        },

        duration: 30,
        borderPencil: 18,
        pencilShades: 12,
        colorShades: 15,
        fullColors: 15,

        object: false,
        array: false,

        background: '#ffffff',
        callbackFn: true,
        callback: null,
        pencil: false,

        pencilWidth: 50,
        pencilHeight: 70,
        marginTop: -50,
        marginLeft: -700,

        disappear: 2,
        fromBottom: false,
        invertAxis: false,
        pencilImage: '/static/img/pencil.png',

        showCode: this.showCode.bind(this),
        draw: this.onDraw.bind(this)
      }
    }
  },

  methods: {
    onChange (event) {
      const file = event.target.files[0]
      this.reader.readAsDataURL(file)
    },

    onDurationChange () {
      if (!this.drawSettings.array) {
        this.drawSettings.object = true
      }

      this.setDuration()
    },

    onImageLoad () {
      this.imageSrc = this.reader.result
    },

    showCode () {
      this.callbackAnimation = 'code'
      this.visibleCode = true
    },

    hideCode () {
      this.callbackAnimation = ''
      this.visibleCode = false
    },

    onDrawEnd () {
      alert('The painting is finished!')
      this.setActivePlugin()
    },

    setActivePlugin () {
      this.activeDraw = true
    },

    onDraw () {
      const _durationObj = {
        borderPencil: this.drawSettings.borderPencil,
        pencilShades: this.drawSettings.pencilShades,
        colorShades: this.drawSettings.colorShades,
        fullColors: this.drawSettings.fullColors
      }

      const _pencilObj = {
        width: this.drawSettings.pencilWidth,
        height: this.drawSettings.pencilHeight,
        marginTop: this.drawSettings.marginTop,
        marginLeft: this.drawSettings.marginLeft,

        fromBottom: this.drawSettings.fromBottom,
        invertAxis: this.drawSettings.invertAxis,
        disappear: this.drawSettings.disappear,
        src: this.drawSettings.pencilImage
      }

      const _callback = this.drawSettings.callback || this.setActivePlugin.bind(this)
      const _duration = this.objectStyle ? _durationObj : this.drawSettings.duration
      const _pencil = this.drawSettings.pencil ? _pencilObj : null

      const settings = {
        background: this.drawSettings.background,
        callback: _callback,
        duration: _duration,
        pencil: _pencil
      }

      if (this.activeDraw) {
        jquery(this.$refs.container).drawImage(settings)
        this.activeDraw = false
      }
    },

    setDuration () {
      clearTimeout(this.durationTimeout)

      if (this.drawSettings.object) {
        this.objectStyle = true

        this.durationTimeout = setTimeout(() => {
          this.duration = `{<br>
            &emsp;&emsp;borderPencil: <span class="number">${this.drawSettings.borderPencil}</span>,<br>
            &emsp;&emsp;pencilShades: <span class="number">${this.drawSettings.pencilShades}</span>,<br>
            &emsp;&emsp;colorShades: <span class="number">${this.drawSettings.colorShades}</span>,<br>
            &emsp;&emsp;fullColors: <span class="number">${this.drawSettings.fullColors}</span><br>
          &emsp;},<br>`
        }, 500)

        return
      }

      this.objectStyle = false

      if (this.drawSettings.array) {
        this.duration = `[<span class="number">${this.drawSettings.borderPencil}</span>,
                          <span class="number">${this.drawSettings.pencilShades}</span>,
                          <span class="number">${this.drawSettings.colorShades}</span>,
                          <span class="number">${this.drawSettings.fullColors}</span>],`
        return
      }

      this.duration = `${this.drawSettings.duration},`
    },

    toggleCallback (show) {
      if (!show) {
        this.drawSettings.callbackFn = false
        this.drawSettings.callback = null
        this.callbackComa = false
        this.callback = ''
      } else {
        setTimeout(() => {
          this.drawSettings.callback = this.onDrawEnd.bind(this)
          this.callbackComa = this.drawSettings.pencil
          this.drawSettings.callbackFn = true

          this.callback = `
            <br><br>&emsp;callback: <span class="function">function</span> () {<br>
              &emsp;&emsp;<span class="function">alert</span>(<span class="string">'The painting is finished!'</span>);<br>
            &emsp;}`
        }, 500)
      }
    },

    togglePencil (show) {
      clearTimeout(this.optionTimeout)
      this.callbackComa = show && this.drawSettings.callback

      if (!show) {
        this.pencil = ''
      } else {
        this.optionTimeout = setTimeout(() => {
          this.pencil = `
            <br><br>&emsp;pencil: {<br>
              &emsp;&emsp;width: <span class="number">${this.drawSettings.pencilWidth}</span>,<br>
              &emsp;&emsp;height: <span class="number">${this.drawSettings.pencilHeight}</span>,<br>
              &emsp;&emsp;marginTop: <span class="number">${this.drawSettings.marginTop}</span>,<br>
              &emsp;&emsp;marginLeft: <span class="number">${this.drawSettings.marginLeft}</span>,<br><br>

              &emsp;&emsp;disappear: <span class="number">${this.drawSettings.disappear}</span>,<br>
              &emsp;&emsp;fromBottom: <span class="number">${this.drawSettings.fromBottom.toString()}</span>,<br>
              &emsp;&emsp;invertAxis: <span class="number">${this.drawSettings.invertAxis.toString()}</span>,<br>
              &emsp;&emsp;src: <span class="string">'${this.drawSettings.pencilImage}'</span><br>
            &emsp;}
          `
        }, 500)
      }
    },

    setPencilOption () {
      this.togglePencil(true)
      this.drawSettings.pencil = true
    },

    setOptions () {
      this.gui.add(this.drawSettings, 'uploadImage').name('Upload Image')
      const timings = this.gui.addFolder('Timings')

      timings.add(this.drawSettings, 'duration', 1, 60).step(1).name('Duration').onChange(() => {
        this.drawSettings.object = false
        this.drawSettings.array = false
        this.setDuration()
      })

      timings.add(this.drawSettings, 'borderPencil', 1, 30).step(1).name('Border Pencil').onChange(this.onDurationChange.bind(this))
      timings.add(this.drawSettings, 'pencilShades', 1, 30).step(1).name('Pencil Shades').onChange(this.onDurationChange.bind(this))
      timings.add(this.drawSettings, 'colorShades', 1, 30).step(1).name('Color Shades').onChange(this.onDurationChange.bind(this))
      timings.add(this.drawSettings, 'fullColors', 1, 30).step(1).name('Full Colors').onChange(this.onDurationChange.bind(this))

      timings.add(this.drawSettings, 'object').name('Object Style').listen().onChange(() => {
        this.drawSettings.array = false
        this.setDuration()
      })

      timings.add(this.drawSettings, 'array').name('Array Style').listen().onChange(() => {
        this.drawSettings.object = false
        this.setDuration()
      })

      this.gui.addColor(this.drawSettings, 'background').name('Background Color')
      this.gui.add(this.drawSettings, 'callbackFn').name('Callback Function').onChange(this.toggleCallback.bind(this))

      const pencil = this.gui.addFolder('Pencil')
      pencil.add(this.drawSettings, 'pencil').name('Pencil Options').listen().onChange(this.togglePencil.bind(this))

      pencil.add(this.drawSettings, 'pencilWidth', 1, 100).step(1).name('Pencil Width').onChange(this.setPencilOption.bind(this))
      pencil.add(this.drawSettings, 'pencilHeight', 1, 100).step(1).name('Pencil Height').onChange(this.setPencilOption.bind(this))

      pencil.add(this.drawSettings, 'marginTop').name('Margin Top').onChange(this.setPencilOption.bind(this))
      pencil.add(this.drawSettings, 'marginLeft').name('Margin Left').onChange(this.setPencilOption.bind(this))

      pencil.add(this.drawSettings, 'disappear', 0.5, 5.0).step(0.5).name('Disappear In').onChange(this.setPencilOption.bind(this))
      pencil.add(this.drawSettings, 'fromBottom').name('From Bottom').onChange(this.setPencilOption.bind(this))
      pencil.add(this.drawSettings, 'invertAxis').name('Invert Axis').onChange(this.setPencilOption.bind(this))
      pencil.add(this.drawSettings, 'pencilImage').name('Pencil Image').domElement.style.pointerEvents = 'none'

      this.gui.add(this.drawSettings, 'showCode').name('Show Code')
      this.gui.add(this.drawSettings, 'draw').name('Draw')
    }
  },

  mounted () {
    this.reader.onload = this.onImageLoad

    this.pluginJs = document.createElement('script')
    this.pluginJs.src = this.imageDrawerJs
    this.pluginJs.type = 'text/javascript'

    this.pluginCss = document.createElement('link')
    this.pluginCss.href = this.imageDrawerCss
    this.pluginCss.rel = 'stylesheet'

    document.body.appendChild(this.pluginCss)
    document.body.appendChild(this.pluginJs)
    window.jQuery = jquery

    this.gui = new dat.GUI()
    this.setOptions()

    this.toggleCallback(this.drawSettings.callbackFn)
    this.togglePencil(this.drawSettings.pencil)
    setTimeout(removeDatGui, 500)
  },

  beforeDestroy () {
    this.gui.domElement.remove()
    this.pluginCss.remove()
    this.pluginJs.remove()

    delete window.jQuery
    delete this.gui
  },

  metaInfo: {
    title: 'ImageDrawer |',

    meta: [
      { vmid: 'ogtitle', property: 'og:title', content: 'ImageDrawer.js' },
      { vmid: 'twittertitle', name: 'twitter:title', content: 'ImageDrawer.js' },

      { vmid: 'description', name: 'description', content: 'jQuery plugin to animate a drawing image.' },
      { vmid: 'ogdescription', property: 'og:description', content: 'jQuery plugin to animate a drawing image.' },
      { vmid: 'twitterdescription', name: 'twitter:description', content: 'jQuery plugin to animate a drawing image.' },

      { vmid: 'ogimage', property: 'og:image', content: `${window.location.origin}/static/img/experiments/ImageDrawerJs.jpg` },
      { vmid: 'twitterimage', name: 'twitter:image', content: `${window.location.origin}/static/img/experiments/ImageDrawerJs.jpg` }
    ]
  }
}
</script>

<style scoped lang="scss">
@import 'animations';
@import 'variables';

.image-drawer-js-page {
  overflow: hidden;
  height: 100%;

  .image-container {
    transform: translate(-50%, -50%);

    text-align: center;
    position: absolute;

    max-height: 630px;
    max-width: 1200px;

    width: 75%;
    left: 50%;
    top: 50%;

    @include breakpoint($sm-down) {
      transform: translateY(-50%);
      max-width: 100%;

      margin: auto 0;
      width: 100%;
      left: 0;
    }

    img {
      display: block;
      height: auto;
      width: 100%;
    }
  }

  input {
    position: absolute;
    visibility: hidden;

    z-index: -1;
    opacity: 0;
  }
}

.code-container {
  transition: height 0.5s $ease-in-quint, opacity 0.5s;
  background-color: rgba($dark-gray, 0.9);

  pointer-events: all;
  user-select: auto;
  position: fixed;

  padding: 25px;
  margin: auto;
  z-index: 1;

  height: 120px;
  width: 330px;

  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @include breakpoint($xs) {
    transform: scale(0.75);
  }

  &.object {
    height: 200px;
  }

  &.callback {
    height: 200px;

    &.object {
      height: 320px;
    }
  }

  &.pencil {
    height: 365px;

    &.object {
      height: 480px;
    }

    &.callback {
      height: 440px;

      &.object {
        height: 560px;
      }
    }
  }

  &.hidden {
    pointer-events: none;
    opacity: 0;
  }

  .close-button-container {
    margin-bottom: 20px;
    margin-left: auto;

    position: relative;
    text-align: right;
    cursor: pointer;

    height: 20px;
    width: 20px;

    &:hover {
      animation: rotate 0.5s $ease-in-quart forwards;
    }
  }

  .close-button {
    background-color: $silver;
    position: absolute;

    height: 2px;
    width: 20px;

    right: 0;
    top: 9px;

    &.left {
      transform: rotate(45deg);
    }

    &.right {
      transform: rotate(-45deg);
    }
  }

  span,
  code {
    font-family: monospace;
    font-style: italic;
    line-height: 20px;
    font-weight: 300;
    font-size: 16px;

    position: relative;
    cursor: default;

    &.code-preview {
      margin-bottom: 25px;
      display: block;
      color: $silver;

      height: 80%;
      width: 100%;
    }

    &::selection {
      background-color: $silver;
      color: $black;
    }
  }

  .coma {
    display: inline-block;
    margin-left: -10px;
  }

  .code-enter-active,
  .code-leave-active {
    transition: opacity 0.3s;
  }

  .code-enter,
  .code-leave-to {
    opacity: 0;
  }
}
</style>
