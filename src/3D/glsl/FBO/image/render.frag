precision highp float;

varying float power;

void main (void) {
  vec3 color = vec3(clamp(power, 0.2, 0.6));
  gl_FragColor = vec4(color, 1.0);
}
