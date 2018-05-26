precision highp float;

varying vec4 vColor;

void main(void) {
  // Gets distance in range 0.0 to 1.0 between:
  // - gl_PointCoord => current point (pixel) coordinates
  // - vec2(0.5)     => center of current particle
  float d = distance(gl_PointCoord, vec2(0.5));

  // if distance between this 2 points is greater then
  // 0.5 (particle radius), discards current point
  if (d > 0.5) discard;

  // Otherwise, sets particle color to this point:
  gl_FragColor = vColor;
}
