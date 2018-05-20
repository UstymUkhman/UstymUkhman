<template>
  <div class="container">

    <transition>
      <ThreejsCanvas
        class="threejs-canvas"
        :width="viewPort.width"
        :height="viewPort.height - 150"
        :debug="true"
        :loading.sync="canvasLoading"
        :world="worlds[currentWorldIndex]"
        :worldData="worldData[currentWorldIndex]"
        />
    </transition>

    <div class="switch-worlds" @click="advanceWorldIndex()">Switch Scene</div>

    <transition>
      <Spinner class="loading" color="#ffffff" v-if="canvasLoading" />
    </transition>
  </div>
</template>

<script>
import Viewport from '@/mixins/Viewport'
import Spinner from 'vue-spinner/src/ScaleLoader.vue'

import ThreejsCanvas from '@/3d/components/ThreejsCanvas'
import FirePrerenderEvent from '@/mixins/FirePrerenderEvent'

import GLTFViewerWorld from '@/3d/worlds/GLTFViewerWorld'

export default {
  name: 'Threejs',

  mixins: [FirePrerenderEvent, Viewport],

  data: function () {
    return {
      canvasLoading: true,
      currentWorldIndex: 0,

      worldData: [
        {
          gltf: import('@/3d/assets/gltf/shield/shield.gltf'),
          rendererData: {
            bloomPass: {
              strength: 0.5
            }
          }
        },
        {
          gltf: import('@/3d/assets/gltf/boom-box/BoomBox.gltf'),
          envMap: [
            import('@/3d/assets/envmaps/bridge2/posx.jpg'), import('@/3d/assets/envmaps/bridge2/negx.jpg'),
            import('@/3d/assets/envmaps/bridge2/posy.jpg'), import('@/3d/assets/envmaps/bridge2/negy.jpg'),
            import('@/3d/assets/envmaps/bridge2/posz.jpg'), import('@/3d/assets/envmaps/bridge2/negz.jpg')
          ],
          scale: 100
        },
        {
          gltf: import('@/3d/assets/gltf/damaged-helmet/DamagedHelmet.gltf'),
          envMap: [
            import('@/3d/assets/envmaps/studio/posx.jpg'), import('@/3d/assets/envmaps/studio/negx.jpg'),
            import('@/3d/assets/envmaps/studio/posy.jpg'), import('@/3d/assets/envmaps/studio/negy.jpg'),
            import('@/3d/assets/envmaps/studio/posz.jpg'), import('@/3d/assets/envmaps/studio/negz.jpg')
          ],
          rendererData: {
            FXAAPass: {
              enabled: false
            },
            SMAAPass: {
              enabled: true
            },
            bloomPass: {
              strength: 0.4,
              radius: 1,
              threshold: 0.6
            }
          }
        },
        {
          gltf: import('@/3d/assets/gltf/sci-fi-helmet/SciFiHelmet.gltf'),
          envMap: [
            import('@/3d/assets/envmaps/bridge2/posx.jpg'), import('@/3d/assets/envmaps/bridge2/negx.jpg'),
            import('@/3d/assets/envmaps/bridge2/posy.jpg'), import('@/3d/assets/envmaps/bridge2/negy.jpg'),
            import('@/3d/assets/envmaps/bridge2/posz.jpg'), import('@/3d/assets/envmaps/bridge2/negz.jpg')
          ]
        }
      ],

      worlds: [
        GLTFViewerWorld,
        GLTFViewerWorld,
        GLTFViewerWorld,
        GLTFViewerWorld
      ]
    }
  },

  components: {
    ThreejsCanvas,
    Spinner
  },

  methods: {
    advanceWorldIndex: function () {
      let newIndex = this.currentWorldIndex + 1
      if (newIndex > this.worlds.length - 1) {
        newIndex = 0
      }
      this.currentWorldIndex = newIndex
    }
  },

  metaInfo: function () {
    return {
      // threejs page browser title
      title: this.$gettext('Threejs Page')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'breakpoints';
@import 'app-colors';
@import 'easings';
@import 'mixins';
@import 'sprite';
@import 'z-index';

.container {
  width: 100%;
  height: 100%;
}
.threejs-canvas {
  position: absolute;
}

.switch-worlds {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px 20px;
  background-color: $c-gray;
  cursor: pointer;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
