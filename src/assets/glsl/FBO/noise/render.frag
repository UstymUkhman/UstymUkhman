precision highp float;

uniform vec3 color;

varying float size;

void main (void) {
  float alpha = 0.2 + color.x * (0.3 / 191.875);
  gl_FragColor = vec4(color, alpha);
}
