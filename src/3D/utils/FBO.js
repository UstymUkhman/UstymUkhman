import { OrthographicCamera } from '@three/cameras/OrthographicCamera'
import { WebGLRenderTarget } from '@three/renderers/WebGLRenderTarget'
import { BufferAttribute } from '@three/core/BufferAttribute'
import { BufferGeometry } from '@three/core/BufferGeometry'

import { Points } from '@three/objects/Points'
import { Scene } from '@three/scenes/Scene'
import { Mesh } from '@three/objects/Mesh'

import { RGBFormat, FloatType, NearestFilter } from '@three/constants.js'

export default class Fbo {
  constructor (width, height, renderer, simulationMaterial, renderMaterial) {
    const gl = renderer.getContext()

    // 1. FLOAT Textures are required to store positions:
    if (!gl.getExtension('OES_texture_float')) {
      console.error('Float textures are not supported.')
    }

    // 2. Textures need to be accessed from within the vertex shader:
    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0) {
      console.error('Vertex shader cannot read textures.')
    }

    // 3. Render To Texture setup:
    this.scene = new Scene()
    this.camera = new OrthographicCamera(
      -1, 1, 1, -1, 1 / Math.pow(2, 53), 1
    )

    // 4. Target texture setup:
    const options = {
      minFilter: NearestFilter, // Sample square pixels
      magFilter: NearestFilter, // Sample square pixels
      format: RGBFormat, // Could be also RGBAFormat
      type: FloatType // Precise coordinates (not ints)
    }

    this.target = new WebGLRenderTarget(width, height, options)

    // 5. Simulation setup:
    // (Creates a bi-unit quadrilateral and uses the simulation material to update the Float Texture
    const geometry = new BufferGeometry()

    geometry.addAttribute('position', new BufferAttribute(
      new Float32Array([
        // Bottom Left Triangle
        -1, -1, 0, 1, 1, 0, -1, 1, 0,

        // Top Right Triangle
        -1, -1, 0, 1, -1, 0, 1, 1, 0
      ]), 3
    ))

    geometry.addAttribute('uv', new BufferAttribute(
      new Float32Array([
        // Bottom Left Triangle
        0, 0, 0, 1, 1, 1,

        // Top Right Triangle
        0, 0, 1, 0, 1, 1
      ]), 2
    ))

    this.scene.add(new Mesh(geometry, simulationMaterial))

    // 6. Particles setup:
    const size = width * height
    const vertices = new Float32Array(size * 3)

    // Map Particles in a cube
    // with length = width * height:
    for (let i = 0; i < size; i++) {
      const i3 = i * 3
      vertices[i3] = (i % width) / width
      vertices[i3 + 1] = (i / width) / height
    }

    const particles = new BufferGeometry()
    particles.addAttribute('position', new BufferAttribute(vertices, 3))

    this.particles = new Points(particles, renderMaterial)
    this.renderer = renderer
  }

  // 7. Update loop setup:
  update () {
    // Updates the simulation and render the result in a target texture:
    this.renderer.render(this.scene, this.camera, this.target, true)

    // Uses the result of the swap as the new position for the particles' renderer:
    this.particles.material.uniforms.positions.value = this.target.texture
  }
}
