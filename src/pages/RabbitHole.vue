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
import FLOOR_BOUND from '@/assets/textures/floor_bound.jpg'
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
import { Group } from 'three/src/objects/Group'

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

const GREEN = 0x00CC00
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
      camera = new PerspectiveCamera(4, screen.size.ratio, 1, depth)
      camera.rotation.x = -Math.PI / 4.8825
      camera.position.z = -0.25
      scene.add(camera)
    }

    function createLights (): void {
      const ambientLight = new AmbientLight(WHITE, 0.25)
      const directionalLight = new DirectionalLight(WHITE, 0.5)

      directionalLight.target.position.set(0, -14, center)
      directionalLight.scale.set(2.5, 1, depth / 20)
      directionalLight.position.set(0, 51, center)
      directionalLight.target.updateMatrixWorld()

      directionalLight.shadow.camera.bottom = -depth / 2
      directionalLight.shadow.camera.top = depth / 2
      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.mapSize.width = 2048

      directionalLight.shadow.camera.right = 25.0
      directionalLight.shadow.camera.left = -25.0
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 65.0

      directionalLight.shadow.bias = -0.001
      directionalLight.castShadow = true

      doorLight = new Mesh(
        new PlaneGeometry(60, 75),
        new MeshBasicMaterial({
          transparent: true,
          color: WHITE,
          opacity: 0
        })
      )

      doorLight.position.set(0, 18.5, -25)
      doorLight.rotation.set(0, 0, 0)

      scene.add(directionalLight)
      scene.add(ambientLight)
      scene.add(doorLight)
    }

    async function createFloor (): Promise<Group> {
      const bound = await loader.loadTexture(FLOOR_BOUND)
      const texture = await loader.loadTexture(FLOOR)

      const floor = new Group()
      const geometry = new PlaneGeometry(50, 50)
      const length = Math.ceil(experiments.length / 2) * 2

      texture.wrapS = texture.wrapT = MirroredRepeatWrapping
      texture.needsUpdate = true

      for (let i = 0, last = length - 1; i < length; i++) {
        const tile = new Mesh(
          geometry, new MeshPhongMaterial({
            map: !i || i === last ? bound : texture,
            premultipliedAlpha: true,
            transparent: true,
            color: 0x32784B
          })
        )

        if (i === last) tile.rotateZ(Math.PI)
        else if (!i) tile.receiveShadow = true

        tile.position.set(0, i * -50, 0)
        floor.add(tile)
      }

      floor.position.set(0, -14, 0)
      floor.rotation.x = -PI.d2

      scene.add(floor)
      return floor
    }

    async function createWalls (): Promise<Mesh> {
      const emptyWall = await loader.loadTexture(DOOR_WALL)
      const fullWall = await loader.loadTexture(WALL)

      emptyWall.wrapS = emptyWall.wrapT = MirroredRepeatWrapping
      fullWall.wrapS = fullWall.wrapT = MirroredRepeatWrapping

      emptyWall.needsUpdate = true
      fullWall.needsUpdate = true

      emptyWall.repeat.set(1, 1)
      fullWall.repeat.set(1, 1)

      const wallGeometry = new PlaneGeometry(50, 65)
      const fullMaterial = new MeshBasicMaterial({ map: fullWall })

      const emptyMaterial = new MeshBasicMaterial({
        alphaMap: emptyWall,
        transparent: true,
        map: emptyWall,
        opacity: 10
      })

      const frontWall = new Mesh(wallGeometry, fullMaterial)
      const backWall = new Mesh(wallGeometry, emptyMaterial)

      backWall.position.set(0, 18.5, depth - 25)
      frontWall.position.set(0, 18.5, -25)
      backWall.rotateY(Math.PI)

      for (let i = 0, length = Math.ceil(experiments.length / 2) * 4; i < length; i++) {
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

      scene.add(frontWall)
      scene.add(backWall)

      return frontWall
    }

    async function createCeiling (): Promise<Mesh> {
      const sideTexture = await loader.loadTexture(SIDE_CEILING)
      const frontTexture = await loader.loadTexture(FRONT_CEILING)

      frontTexture.wrapS = frontTexture.wrapT = MirroredRepeatWrapping
      sideTexture.wrapS = sideTexture.wrapT = MirroredRepeatWrapping

      const segments = depth / 50
      const offset = depth / 2 - 3

      frontTexture.needsUpdate = true
      sideTexture.needsUpdate = true

      frontTexture.repeat.set(1, 1)
      sideTexture.repeat.set(segments, 1)

      const frontCeil = new Mesh(
        new PlaneGeometry(50, 6, 1, segments),
        new MeshBasicMaterial({ map: frontTexture })
      )

      const leftCeil = new Mesh(
        new PlaneGeometry(depth, 6, 1, segments),
        new MeshBasicMaterial({ map: sideTexture })
      )

      const ceiling = new Mesh(
        new PlaneGeometry(50, depth),
        new MeshBasicMaterial({ color: WHITE })
      )

      const rightCeil = leftCeil.clone()
      const backCeil = frontCeil.clone()

      frontCeil.position.set(0, 50.65, center - offset)
      frontCeil.rotateX(PI.d2)

      backCeil.position.set(0, 50.65, center + offset)
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
      const door = await loader.loadModel(DOOR as JSON)
      const frame = await loader.loadModel(FRAME as JSON)

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

      doorMaterials[0].color = new Color(WHITE)
      doorMaterials[1].color = new Color(GREEN)

      const frontFrame = new Mesh(frame.geometry, frameMaterials)
      const frontDoor = new Mesh(door.geometry, doorMaterials)

      frontFrame.position.set(0, -10.5, depth - 25)
      frontFrame.rotation.y = Math.PI
      frontFrame.scale.set(4, 4, 4)

      frontDoor.position.set(8.75, 0, 0)
      frontDoor.rotation.y = Math.PI
      frontDoor.scale.set(4, 4, 4)

      const pivot = new Object3D()

      pivot.position.set(-8.75, -10.4, depth - 25.25)
      pivot.rotation.y = 0

      scene.add(frontFrame)
      pivot.add(frontDoor)

      doors.push({ door: frontDoor, pivot })
      scene.add(new Object3D().add(pivot))

      for (let i = 0, length = Math.ceil(experiments.length / 2) * 2; i < length; i++) {
        const frame = frontFrame.clone()
        const door = frontDoor.clone()

        const pitch = new Object3D()
        const pivot = new Object3D()

        let rotation = 8.75
        let rotationY = PI.d2

        let framePositionX = -25
        let doorPositionX = -24.8

        const positionZ = getDoorDepth(i)
        let pivotRotation = positionZ - 8.75

        if (i % 2) {
          rotation *= -1
          rotationY *= -1

          doorPositionX = -doorPositionX
          pivotRotation = positionZ + 8.75
          framePositionX = -framePositionX
        }

        pivot.position.set(doorPositionX, -10.4, pivotRotation)
        frame.position.set(framePositionX, -10.5, positionZ)
        door.position.set(0, 0, rotation)

        frame.rotation.y = rotationY
        door.rotation.y = rotationY
        door.userData.index = i
        pivot.rotation.y = 0

        pivot.add(door)
        pitch.add(pivot)

        scene.add(frame)
        scene.add(pitch)

        doors.push({
          door, pivot
        })
      }

      doorObjects = doors.map(({ door }) => door)
      return frontDoor
    }

    function getDoorDepth (index: number): number {
      return (index % 2 ? index - 1 : index) * 50 + 50
    }

    async function createTable (): Promise<Mesh> {
      const table = new Mesh(
        (await loader.loadModel(TABLE as JSON)).geometry,
        new MeshPhongMaterial({ color: 0xBDBDBD })
      )

      table.position.set(0, -21.4, -11.7)
      table.scale.set(7.5, 7.5, 7.5)
      table.rotateY(PI.d2)

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
        [Direction.UP]: -5,
        [Direction.RIGHT]: 18,
        [Direction.DOWN]: depth - 32,
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

      const { width, height } = screen.size
      const pixelRatio = renderer.getPixelRatio()

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
      const lightMaterial = doorLight.material as MeshBasicMaterial

      if (pressed && pivot.rotation.y < 1.56) {
        if (!pivot.rotation.y && playDoorSound(door)) return
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

      else if (pivot.rotation.y > 0.5) {
        lightMaterial.opacity += 0.01
        canOpen.value = false
        exit.value = true
      }

      else if (pivot.rotation.y <= 0) {
        lightMaterial.opacity = 0
        pivot.rotation.y = 0
        selectedDoor = null
        exit.value = false
      }
    }

    function playDoorSound (door: Mesh): boolean {
      const closed = door.userData.index >= experiments.length
      closed ? Sounds.closedDoor() : Sounds.openedDoor()

      setDoorLight(door)
      return closed
    }

    function setDoorLight (door: Mesh): void {
      doorLight.position.z = getDoorDepth(door.userData.index)
      isExperiment = !!door.position.z

      if (!door.position.z) {
        doorLight.position.z = depth - 22.5
        doorLight.rotation.y = Math.PI
        doorLight.position.x = 0.0
      }

      else if (door.position.z < 0) {
        doorLight.rotation.y = -PI.d2
        doorLight.position.x = 27.5
      }

      else {
        doorLight.position.x = -27.5
        doorLight.rotation.y = PI.d2
      }
    }

    function onRedirect (): void {
      screenAnimation.value = true
      disableControls()
    }

    function redirect (): void {
      if (isExperiment && selectedDoor) {
        const index = selectedDoor.door.userData.index as number
        const experiment = experiments[index]

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

      if (visibleLight.value) {
        setTimeout(onRedirect, 2000)
        return cancelAnimationFrame(frame)
      }
    }

    const description = computed(() =>
      ready.value ? `Hold left mouse button to open ${doorDescription.value}` : 'Press ENTER to interact'
    )

    const visibleDescription = computed(() =>
      !exit.value && (forceDescription.value || (canOpen.value && !!doorDescription.value))
    )

    let messageComplete = router.currentRoute.value.params.skipLettering === 'true'
    const experiments = Experiments as Array<Experiment>
    const depth = Math.ceil(experiments.length / 2) * 100

    const screen = new Viewport(onResize)
    const raycaster = new Raycaster()
    const loader = new AssetsLoader()
    const focus = new Vector2(0, 2)
    const scene = new Scene()

    const visibleGuidelines = ref(true)
    const forceDescription = ref(false)
    const screenAnimation = ref(false)
    const doorDescription = ref('')
    const visibleLight = ref(false)

    let doorObjects: Array<Mesh> = []
    const center = depth / 2 - 25.0
    const doors: Array<Door> = []
    raycaster.far = 15.0

    let controls: FirstPersonControls
    let selectedDoor: Door | null
    let camera: PerspectiveCamera
    let composer: EffectComposer
    let renderer: WebGLRenderer
    let lettering: Lettering
    let shader: ShaderPass
    let fxaa: ShaderPass
    let doorLight: Mesh

    const canOpen = ref(false)
    const ready = ref(false)
    const exit = ref(false)
    const message = ref()
    const hole = ref()

    let isExperiment: boolean
    let introComplete = false
    let introStarted = false
    let pressed = false
    let frame: number

    onMounted(() => {
      lettering = new Lettering(message.value, 50, 0)
      firePrerender({ title: 'Rabbit Hole' })
      context.emit('toggle-overlay', true)

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

      if (messageComplete) {
        lettering.skipLettering()
      }
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
