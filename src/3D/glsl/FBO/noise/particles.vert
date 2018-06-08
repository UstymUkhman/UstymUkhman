precision mediump float;

varying vec2 vUv;

void main (void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}
