precision mediump float;

varying vec3 norm;
varying vec3 eye;

void main (void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  eye = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
  norm = normalize(normalMatrix * normal);
}
