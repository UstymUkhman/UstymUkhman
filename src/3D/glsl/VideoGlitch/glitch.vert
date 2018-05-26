precision mediump float;

uniform int show;
uniform float size;

uniform float xSlide;
uniform float ySlide;

varying vec2 vUv;

void main (void) {
  float s = (show == 1) ? size : 1.0;
  vec4 position = vec4(position, 1.0 / s);
  vec4 mvPosition = modelViewMatrix * position;

  gl_Position = projectionMatrix * mvPosition;

  if (show == 1) {
    gl_Position.x += xSlide * 2.0;
    gl_Position.y += ySlide * 2.0;
  }

  gl_PointSize = size;
  vUv = uv;
}
