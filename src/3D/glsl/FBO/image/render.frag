precision highp float;

varying float power;

void main (void) {
  vec3 color = vec3(clamp(power, 0.1, 0.8));
  gl_FragColor = vec4(color, 1.0);
}
