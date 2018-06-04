// THREE.js BlurShader (vertex shader is the same for Vertical & Horizontal blur):
// https://github.com/mrdoob/three.js/blob/dev/examples/js/shaders/VerticalBlurShader.js
// https://github.com/mrdoob/three.js/blob/dev/examples/js/shaders/HorizontalBlurShader.js

precision mediump float;

varying vec2 vUv;

void main (void) {
  vec4 position = vec4(position, 1.0);
  vec4 mvPosition = modelViewMatrix * position;

  gl_Position = projectionMatrix * mvPosition;
  vUv = uv;
}
