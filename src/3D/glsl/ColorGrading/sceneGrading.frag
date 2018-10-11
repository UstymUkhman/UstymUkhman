#include ../sample2DAs3DTexture.frag;

precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D grading;

uniform int isLookup;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);
  vec4 gradedColor = color;
  vec4 baseColor = color;

  color.g = 1.0 - color.g;
  gradedColor = sample2DAs3DTexture(grading, color.rgb, 16.0);
  gradedColor.a = color.a;

  gl_FragColor = mix(baseColor, gradedColor, 0.75);
}
