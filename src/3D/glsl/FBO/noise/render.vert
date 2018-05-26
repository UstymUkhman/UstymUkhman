precision mediump float;

uniform sampler2D positions;

varying float size;

void main (void) {
  vec3 pos = texture2D(positions, position.xy).xyz;

  gl_PointSize = size = max(1.0, (step(1.0 - (1.0 / 512.0), position.x)) * 3.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
