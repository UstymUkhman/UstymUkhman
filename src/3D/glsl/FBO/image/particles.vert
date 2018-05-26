precision mediump float;

uniform float time;

varying float vTime;
varying vec2 vUv;

void main (void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vTime = time;
  vUv = uv;
}
