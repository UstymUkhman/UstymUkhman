precision mediump float;

uniform sampler2D positions;

void main (void) {
  vec3 position = texture2D(positions, position.xy).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1.0;
}
