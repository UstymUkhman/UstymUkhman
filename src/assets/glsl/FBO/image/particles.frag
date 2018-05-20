precision highp float;

uniform sampler2D positions;

varying float vTime;
varying vec2 vUv;

void main (void) {
  vec3 position = texture2D(positions, vUv).xyz;
  position.y *= vTime;

  gl_FragColor = vec4(position, 1.0);
}
