precision mediump float;

varying float fragDepth;
varying vec2 vUv;

void main (void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}
