<template>
  <article itemtype="http://schema.org/WebPage" class="hole-page" itemscope>
    <canvas ref="hole"></canvas>

    <transition appear>
      <div v-if="visibleGuidelines" class="guidelines" itemprop="description">
        <p ref="message" class="text">
          Welcome to the real world.          \\\
          Use W, A, S, D keys to move and drag you mouse to look around.\\
          Press left mouse button to interact with the enviroment.\\\\\
          Press  ENTER  when you're ready.
        </p>
      </div>
    </transition>

    <transition appear>
      <div v-if="visibleDescription" class="description">
        <span>{{ description }}</span>
      </div>
    </transition>

    <div class="light" :class="{'fade': visibleLight}"></div>
    <ScreenAnimation v-if="screenAnimation" @complete-animation="redirect" />
  </article>
</template>

<script lang="ts">
import { MirroredRepeatWrapping, ACESFilmicToneMapping, PCFSoftShadowMap, LinearFilter, sRGBEncoding, GLSL3 } from 'three/src/constants'
import { defineComponent, onBeforeUnmount, SetupContext, ComputedRef, onMounted, computed, Ref, ref } from 'vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FirstPersonControls, Direction } from '@/utils/3D/FirstPersonControls'

import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { DirectionalLight } from 'three/src/lights/DirectionalLight'

import { Lettering, Loading, Sounds, firePrerender } from '@/utils'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import FRONT_CEILING from '@/assets/textures/front_ceiling.jpg'
import SIDE_CEILING from '@/assets/textures/side_ceiling.jpg'
import DOOR_WALL from '@/assets/textures/door_wall.png'
import FLOOR from '@/assets/textures/floor.jpg'
import WALL from '@/assets/textures/wall.jpg'
import MATRIX from '@/assets/img/lut.png'

import ScreenAnimation from '@components/ScreenAnimation.vue'
import { AmbientLight } from 'three/src/lights/AmbientLight'
import Experiments from '@/assets/data/experiments.json'
import { Raycaster } from 'three/src/core/Raycaster'
import { Texture } from 'three/src/textures/Texture'

import KEYBOARD from '@/assets/models/keyboard.json'
import SYSTEM_UNIT from '@/assets/models/case.json'
import MONITOR from '@/assets/models/monitor.json'
import TABLE from '@/assets/models/table.json'
import FRAME from '@/assets/models/frame.json'
import DOOR from '@/assets/models/door.json'

import AssetsLoader from '@/utils/3D/AssetsLoader'
import { Object3D } from 'three/src/core/Object3D'
import { Viewport, Size } from '@/utils/Viewport'
import { Vector2 } from 'three/src/math/Vector2'

import { Scene } from 'three/src/scenes/Scene'
import { Mesh } from 'three/src/objects/Mesh'
import { Color } from 'three/src/math/Color'

import vertShader from '@/glsl/main.vert'
import fragShader from '@/glsl/main.frag'

import { PI } from '@/utils/Number'
import router from '@/router'
import anime from 'animejs'

interface TemplateValues {
  readonly visibleDescription: ComputedRef<boolean>
  readonly message: Ref<HTMLParagraphElement>
  readonly description: ComputedRef<string>
  readonly visibleGuidelines: Ref<boolean>
  readonly screenAnimation: Ref<boolean>
  readonly hole: Ref<HTMLCanvasElement>
  readonly visibleLight: Ref<boolean>
  readonly redirect: () => void
}

const GREEN = 0x7CA294
const WHITE = 0xFFFFFF

type Door = {
  pivot: Object3D,
  door: Mesh
}

export default defineComponent({
  name: 'RabbitHole',

  components: {
    ScreenAnimation
  },

  setup (props, context: SetupContext): TemplateValues {
    function createCamera (): void {
      camera = new PerspectiveCamera(4, screen.size.ratio, 1, 500)
      camera.rotation.x = -Math.PI / 4.8825
      camera.position.z = -0.25
      scene.add(camera)
    }

    function createLights (): void {
      const ambientLight = new AmbientLight(WHITE, 0.25)
      const directionalLight = new DirectionalLight(WHITE, 0.75)

      directionalLight.target.position.set(0, -14, center)
      directionalLight.position.set(0, 51, center)
      directionalLight.target.updateMatrixWorld()

      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 65

      directionalLight.shadow.camera.bottom = -250
      directionalLight.shadow.camera.right = 25
      directionalLight.shadow.camera.left = -25
      directionalLight.shadow.camera.top = 250

      directionalLight.scale.set(2.5, 1, 25)
      directionalLight.shadow.bias = -0.001
      directionalLight.castShadow = true

      scene.add(directionalLight)
      scene.add(ambientLight)
    }

    async function createFloor (): Promise<Mesh> {
      const texture = await loader.loadTexture(FLOOR)

      texture.wrapS = texture.wrapT = MirroredRepeatWrapping
      texture.needsUpdate = true

      const floor = new Mesh(
        new PlaneGeometry(50, 500),
        new MeshPhongMaterial({
          premultipliedAlpha: true,
          transparent: true,
          color: 0x406550,
          map: texture
        })
      )

      floor.position.set(0, -14, center)
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true

      scene.add(floor)
      return floor
    }

    async function createWalls (): Promise<Mesh> {
      const emptyWall = await loader.loadTexture(DOOR_WALL)
      const fullWall = await loader.loadTexture(WALL)

      emptyWall.wrapS = emptyWall.wrapT = MirroredRepeatWrapping
      fullWall.wrapS = fullWall.wrapT = MirroredRepeatWrapping

      const wallGeometry = new PlaneGeometry(50, 65, 1, 1)
      const lightMaterial = new MeshBasicMaterial({
        transparent: true,
        color: WHITE,
        opacity: 0
      })

      leftLight = new Mesh(new PlaneGeometry(510, 75, 1, 1), lightMaterial)
      leftLight.position.set(-25.5, 18.5, center)
      leftLight.rotateY(PI.d2)

      rightLight = leftLight.clone() as Mesh
      rightLight.rotation.y = -PI.d2
      rightLight.position.x = 25.5

      emptyWall.needsUpdate = true
      fullWall.needsUpdate = true

      emptyWall.repeat.set(1, 1)
      fullWall.repeat.set(1, 1)

      const fullMaterial = new MeshBasicMaterial({ map: fullWall })
      const emptyMaterial = new MeshBasicMaterial({
        alphaMap: emptyWall,
        transparent: true,
        map: emptyWall,
        opacity: 10
      })

      const frontWall = new Mesh(wallGeometry, fullMaterial)
      const backWall = new Mesh(wallGeometry, emptyMaterial)

      frontWall.position.set(0, 18.5, center - 250)
      backWall.position.set(0, 18.5, center + 250)

      backWall.rotateY(Math.PI)
      backLight = backWall.clone() as Mesh

      backLight.geometry = new PlaneGeometry(50, 75, 1, 1)
      backLight.material = lightMaterial
      backLight.position.z += 0.5

      for (let i = 0; i < 20; i++) {
        const material = (i % 4 > 1) ? emptyMaterial : fullMaterial
        const wall = new Mesh(wallGeometry, material)

        let positionZ = i * 25
        let rotationY = PI.d2
        let positionX = -25

        if (i % 2) {
          positionX = 25
          rotationY = -PI.d2
          positionZ = (i - 1) * 25
        }

        wall.position.set(positionX, 18.5, positionZ)
        wall.rotateY(rotationY)
        scene.add(wall)
      }

      scene.add(rightLight)
      scene.add(leftLight)

      scene.add(backLight)
      scene.add(frontWall)
      scene.add(backWall)

      return frontWall
    }

    async function createCeiling (): Promise<Mesh> {
      const frontTexture = await loader.loadTexture(FRONT_CEILING)
      const sideTexture = await loader.loadTexture(SIDE_CEILING)

      frontTexture.wrapS = frontTexture.wrapT = MirroredRepeatWrapping
      sideTexture.wrapS = sideTexture.wrapT = MirroredRepeatWrapping

      frontTexture.needsUpdate = true
      sideTexture.needsUpdate = true

      frontTexture.repeat.set(1, 1)
      sideTexture.repeat.set(10, 1)

      const frontCeil = new Mesh(
        new PlaneGeometry(50, 6, 1, 10),
        new MeshBasicMaterial({ map: frontTexture })
      )

      const leftCeil = new Mesh(
        new PlaneGeometry(500, 6, 1, 10),
        new MeshBasicMaterial({ map: sideTexture })
      )

      const ceiling = new Mesh(
        new PlaneGeometry(50, 500),
        new MeshBasicMaterial({ color: WHITE })
      )

      const rightCeil = leftCeil.clone()
      const backCeil = frontCeil.clone()

      frontCeil.position.set(0, 50.65, center - 247)
      frontCeil.rotateX(PI.d2)

      backCeil.position.set(0, 50.65, center + 247)
      backCeil.rotation.set(PI.d2, 0, -Math.PI)

      leftCeil.position.set(-22, 50.75, center)
      leftCeil.rotation.set(PI.d2, 0, -PI.d2)

      rightCeil.position.set(22, 50.75, center)
      rightCeil.rotation.set(PI.d2, 0, PI.d2)

      ceiling.position.set(0, 51, center)
      ceiling.rotateX(PI.d2)

      scene.add(frontCeil)
      scene.add(rightCeil)

      scene.add(backCeil)
      scene.add(leftCeil)

      scene.add(ceiling)
      return ceiling
    }

    async function createDoors (): Promise<Mesh> {
      const frame = await loader.loadModel(FRAME as JSON)
      const door = await loader.loadModel(DOOR as JSON)

      const frameMaterials = [
        (frame.materials![0] as unknown) as MeshPhongMaterial,
        (frame.materials![1] as unknown) as MeshPhongMaterial
      ]

      const doorMaterials = [
        (door.materials![0] as unknown) as MeshPhongMaterial,
        (door.materials![1] as unknown) as MeshPhongMaterial
      ]

      frameMaterials[0].color = new Color(GREEN)
      frameMaterials[1].color = new Color(GREEN)

      doorMaterials[0].color = new Color(0xEEEEEE)
      doorMaterials[1].color = new Color(GREEN)

      const frontFrame = new Mesh(frame.geometry, frameMaterials)
      const frontDoor = new Mesh(door.geometry, doorMaterials)

      frontFrame.position.set(0, -10.5, 475)
      frontFrame.rotation.y = Math.PI
      frontFrame.scale.set(4, 4, 4)

      frontDoor.position.set(8.75, 0, 0)
      frontDoor.rotation.y = Math.PI
      frontDoor.scale.set(4, 4, 4)

      const pivot = new Object3D()

      pivot.position.set(-8.75, -10.4, 474.75)
      pivot.rotation.y = 0

      scene.add(frontFrame)
      pivot.add(frontDoor)

      doors.push({ door: frontDoor, pivot: pivot })
      scene.add(new Object3D().add(pivot))

      for (let i = 0; i < 10; i++) {
        const sideFrame = frontFrame.clone()
        const sideDoor = frontDoor.clone()

        const pitch = new Object3D()
        const pivot = new Object3D()

        let rotation = 8.75
        let rotationY = PI.d2

        let framePositionX = -25
        let doorPositionX = -24.8

        let positionZ = i * 50 + 50
        let pivotRotation = positionZ - 8.75

        if (i % 2) {
          rotation = -8.75
          rotationY = -rotationY

          positionZ = (i - 1) * 50 + 50
          doorPositionX = -doorPositionX

          pivotRotation = positionZ + 8.75
          framePositionX = -framePositionX
        }

        sideFrame.position.set(framePositionX, -10.5, positionZ)
        pivot.position.set(doorPositionX, -10.4, pivotRotation)
        sideDoor.position.set(0, 0, rotation)

        sideFrame.rotation.y = rotationY
        sideDoor.rotation.y = rotationY
        sideDoor.userData.index = i
        pivot.rotation.y = 0

        pivot.add(sideDoor)
        pitch.add(pivot)

        scene.add(sideFrame)
        scene.add(pitch)

        doors.push({
          door: sideDoor as Mesh,
          pivot: pivot
        })
      }

      doorObjects = doors.map(object => object.door)
      return frontDoor
    }

    async function createTable (): Promise<Mesh> {
      const table = new Mesh(
        (await loader.loadModel(TABLE as JSON)).geometry,
        new MeshPhongMaterial({ color: 0xBDBDBD })
      )

      table.position.set(0, -21.4, -11.7)
      table.scale.set(7.5, 7.5, 7.5)
      table.rotateY(Math.PI / 2)

      table.receiveShadow = true
      table.castShadow = true

      scene.add(table)
      return table
    }

    async function createComputer (): Promise<Mesh> {
      const keyboardModel = await loader.loadModel(KEYBOARD as JSON)
      const unitModel = await loader.loadModel(SYSTEM_UNIT as JSON)
      const monitorModel = await loader.loadModel(MONITOR as JSON)

      const keyboard = new Mesh(keyboardModel.geometry, keyboardModel.materials)
      const monitor = new Mesh(monitorModel.geometry, monitorModel.materials)
      const systemUnit = new Mesh(unitModel.geometry, unitModel.materials)

      systemUnit.position.set(-1.2, 3.4, -19)
      systemUnit.receiveShadow = true
      systemUnit.castShadow = true

      keyboard.position.set(0, 3.35, -16.5)
      keyboard.receiveShadow = true
      keyboard.castShadow = true

      monitor.position.set(0, 3.45, -16.5)
      monitor.rotation.set(-0.05, 0, 0)
      monitor.receiveShadow = true
      monitor.castShadow = true

      scene.add(systemUnit)
      scene.add(keyboard)
      scene.add(monitor)

      return monitor
    }

    function createRenderer (): void {
      const { width, height } = screen.size

      renderer = new WebGLRenderer({ canvas: hole.value })
      renderer.setPixelRatio(window.devicePixelRatio || 1)

      renderer.toneMapping = ACESFilmicToneMapping
      renderer.shadowMap.type = PCFSoftShadowMap
      renderer.outputEncoding = sRGBEncoding
      renderer.toneMappingExposure = 0.666

      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      renderer.setSize(width, height)
      renderer.domElement.focus()
    }

    async function createComposer (): Promise<Texture> {
      const lut = await loader.loadTexture(MATRIX)

      composer = new EffectComposer(renderer)
      fxaa = new ShaderPass(FXAAShader)

      composer.addPass(new RenderPass(scene, camera))
      lut.minFilter = lut.magFilter = LinearFilter

      shader = new ShaderPass(
        new ShaderMaterial({
          fragmentShader: fragShader,
          vertexShader: vertShader,
          glslVersion: GLSL3,

          uniforms: {
            ratio: { value: screen.size.ratio },
            tDiffuse: { value: null },
            lut: { value: lut }
          }
        })
      )

      composer.addPass(shader)
      composer.addPass(fxaa)

      updateComposerSize()
      return lut
    }

    function createControls (): void {
      controls = new FirstPersonControls(scene, camera)

      controls.setBorders({
        [Direction.UP]: center - 230,
        [Direction.RIGHT]: 18,
        [Direction.DOWN]: center + 242,
        [Direction.LEFT]: -18
      })
    }

    function createCinematicIntro (): void {
      anime({
        easing: 'easeInOutQuad',
        targets: camera,
        duration: 5000,
        delay: 3000,
        fov: 45,

        begin: () => {
          setTimeout(() => {
            context.emit('toggle-overlay', false)
            visibleGuidelines.value = false
          }, 3500)
        },

        update: () => {
          camera.updateProjectionMatrix()
        },

        complete: () => {
          introComplete = true
          introStarted = false
          controls.activate()

          if (controls.isLocked) {
            controls.enable = true
          }
        }
      })
    }

    function addEventListeners (): void {
      document.addEventListener('mousedown', onMouseDown, false)
      document.addEventListener('mouseup', onMouseUp, false)
      document.addEventListener('keydown', onKeyDown, false)

      window.addEventListener('blur', disableControls, false)
      controls.onPointerUnlock = disableControls
    }

    function onMouseDown (event: MouseEvent): void {
      if (event.button) return
      pressed = controls.isLocked
    }

    function onMouseUp (): void {
      pressed = false
    }

    function onKeyDown (event: KeyboardEvent): void {
      const enable = event.key === 'Enter'
      if (introStarted) return

      if (!introComplete && !messageComplete) {
        lettering.skipLettering()
        messageComplete = true
        return
      }

      if (enable && !introComplete) {
        setTimeout(lettering.dissolve.bind(lettering), 500)
        controls.pointerLock = true
        controls.enable = false

        createCinematicIntro()
        introStarted = true
      }

      if (enable) {
        if (controls.isLocked) {
          disableControls()
        }

        else {
          controls.pointerLock = true
          enableControls()
        }
      }
    }

    function removeEventListeners (): void {
      document.removeEventListener('mousedown', onMouseDown, false)
      document.removeEventListener('mouseup', onMouseUp, false)
      document.removeEventListener('keydown', onKeyDown, false)
      window.removeEventListener('blur', disableControls, false)
    }

    function onResize (size: Size): void {
      renderer.setSize(size.width, size.height)
      camera.aspect = size.ratio

      camera.updateProjectionMatrix()
      updateComposerSize()
    }

    function updateComposerSize (): void {
      const fxaaResolution = fxaa.material.uniforms.resolution.value
      shader.material.uniforms.ratio.value = screen.size.ratio

      const pixelRatio = renderer.getPixelRatio()
      const { width, height } = screen.size

      fxaaResolution.y = 1.0 / (height * pixelRatio)
      fxaaResolution.x = 1.0 / (width * pixelRatio)

      composer.setSize(width, height)
    }

    function enableControls (): void {
      document.addEventListener('mousedown', onMouseDown, false)
      document.addEventListener('mouseup', onMouseUp, false)

      forceDescription.value = false
      ready.value = true
    }

    function disableControls (): void {
      document.removeEventListener('mousedown', onMouseDown, false)
      document.removeEventListener('mouseup', onMouseUp, false)

      forceDescription.value = true
      controls.pointerLock = false
      ready.value = false
    }

    function checkFocusDirection (): void {
      raycaster.ray.direction.copy(controls.cameraDirection).applyEuler(camera.rotation)
      raycaster.setFromCamera(focus, camera)
      canOpen.value = false

      const intersects = raycaster.intersectObjects(doorObjects)

      if (intersects.length) {
        const doorObject = doors.find(mesh =>
          mesh.door.id === intersects[0].object.id
        ) as Door

        const index = doorObject.door.userData.index as number
        const experiments = Experiments as Array<Experiment>
        const experimentDoor = index !== undefined

        doorDescription.value = experimentDoor
          ? experimentDoor && index < experiments.length
            ? experiments[index].title : ''
          : 'all experiments'

        selectedDoor = doorObject
        canOpen.value = true
      }

      if (selectedDoor) {
        openTheDoor(selectedDoor)
      }
    }

    function openTheDoor (doorObject: Door): void {
      const { door, pivot } = doorObject

      if (pressed && pivot.rotation.y < 1.56) {
        if (!pivot.rotation.y && closedDoor(door.userData.index)) return
        pivot.rotation.y += 0.01
      }

      else if (!pressed && pivot.rotation.y > 1) {
        pivot.rotation.y += 0.01
      }

      else if (!pressed && pivot.rotation.y > 0) {
        pivot.rotation.y -= 0.02
      }

      if (pivot.rotation.y > 1.56) {
        visibleLight.value = true
        pivot.rotation.y = 1.56
      }

      if (pivot.rotation.y > 1) {
        isRightDoor = door.position.z < 0
        isExperiment = !!door.position.z
      }

      else if (pivot.rotation.y > 0.5) {
        canOpen.value = false
        exit.value = true
      }

      if (pivot.rotation.y <= 0) {
        const rightLightMaterial = rightLight.material as MeshBasicMaterial
        const leftLightMaterial = leftLight.material as MeshBasicMaterial
        const backLightMaterial = backLight.material as MeshBasicMaterial

        rightLightMaterial.opacity = 0
        leftLightMaterial.opacity = 0
        backLightMaterial.opacity = 0

        selectedDoor = undefined
        pivot.rotation.y = 0
        exit.value = false
      }
    }

    function closedDoor (index: number): boolean {
      const closed = index >= (Experiments as Array<Experiment>).length
      closed ? Sounds.closedDoor() : Sounds.openedDoor()
      return closed
    }

    function fadeInLight (): void {
      !isExperiment
        ? (backLight.material as MeshBasicMaterial).opacity += 0.01
        : ((isRightDoor ? rightLight : leftLight).material as MeshBasicMaterial).opacity += 0.01
    }

    function onRedirect (): void {
      screenAnimation.value = true
      disableControls()
    }

    function redirect (): void {
      if (isExperiment && selectedDoor) {
        const index = selectedDoor.door.userData.index as number
        const experiment = (Experiments as Array<Experiment>)[index]

        experiment.newTab
          ? location.href = experiment.page
          : router.push({ name: experiment.title })
      }

      else {
        Loading.checkActiveItem(true)
        router.push({ name: 'Experiments' })
      }
    }

    function animate (): void {
      frame = requestAnimationFrame(animate)
      composer.render()

      if (controls && introComplete) {
        checkFocusDirection()
        controls.update()
      }

      if (exit.value) {
        if (visibleLight.value) {
          setTimeout(onRedirect, 2000)
          return cancelAnimationFrame(frame)
        }

        fadeInLight()
      }
    }

    const description = computed(() =>
      ready.value ? `Hold left mouse button to open ${doorDescription.value}` : 'Press ENTER to interact'
    )

    const visibleDescription = computed(() =>
      !exit.value && (forceDescription.value || (canOpen.value && !!doorDescription.value))
    )

    let messageComplete = router.currentRoute.value.params.skipLettering === 'true'

    const screen = new Viewport(onResize)
    const visibleGuidelines = ref(true)
    const forceDescription = ref(false)
    const screenAnimation = ref(false)
    let selectedDoor: Door | undefined

    let doorObjects: Array<Mesh> = []
    let controls: FirstPersonControls
    const raycaster = new Raycaster()
    const loader = new AssetsLoader()
    const focus = new Vector2(0, 2)
    const doorDescription = ref('')
    const visibleLight = ref(false)
    const doors: Array<Door> = []

    let camera: PerspectiveCamera
    let composer: EffectComposer
    let renderer: WebGLRenderer
    const canOpen = ref(false)
    const scene = new Scene()
    let isExperiment: boolean

    let introComplete = false
    let introStarted = false
    let isRightDoor: boolean
    let lettering: Lettering
    let shader: ShaderPass
    let fxaa: ShaderPass

    const ready = ref(false)
    const exit = ref(false)
    const message = ref()
    const hole = ref()

    let rightLight: Mesh
    let leftLight: Mesh
    let backLight: Mesh
    let pressed = false
    raycaster.far = 15
    const center = 225
    let frame: number

    onMounted(() => {
      lettering = new Lettering(message.value, 50, 0)
      firePrerender({ title: 'Rabbit Hole' })

      createCamera()
      createLights()

      createFloor()
      createWalls()
      createCeiling()

      createDoors()
      createTable()
      createComputer()

      createRenderer()
      createComposer()
      createControls()
      addEventListeners()

      lettering.animate(() => {
        messageComplete = true
        animate()
      })

      messageComplete && lettering.skipLettering()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      removeEventListeners()

      controls.dispose()
      renderer.dispose()
      screen.dispose()
    })

    return {
      visibleDescription,
      visibleGuidelines,
      screenAnimation,
      visibleLight,
      description,
      redirect,
      message,
      hole
    }
  }
})
</script>

<style lang="scss" scoped>
.guidelines {
  background-color: $black;
  @include center-size;
  z-index: 1;

  .text {
    @include center-size(920px, 154px);
    text-align: center;
    visibility: hidden;
  }
}

.description {
  backface-visibility: hidden;
  transform: translateX(-50%);
  background-color: $black;

  border-radius: 5px;
  position: absolute;

  padding: 10px;
  bottom: 2.5%;
  left: 50%;
}

.light {
  transition: background-color 1s;
  background-color: transparent;
  @include center-size;

  &.fade {
    background-color: $white;
  }
}
</style>
