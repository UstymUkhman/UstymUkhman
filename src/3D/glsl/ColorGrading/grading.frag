#include ../sample2DAs3DTexture.frag;
#include ../lookupFrom2DTexture.frag;

precision highp float;

uniform sampler2D texture;
uniform sampler2D grading;

uniform int isLookup;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(texture, vUv);
  vec4 gradedColor = color;

  if (isLookup == 1) {
    // 8 x 8 x 64 texture:
    gradedColor = lookupFrom2DTexture(color, grading);
  } else {
    // Invert green coord for THREE.js:
    color.g = 1.0 - color.g;

    // 16 x 16 x 16 texture:
    gradedColor = sample2DAs3DTexture(grading, color.rgb, 16.0);
    gradedColor.a = color.a;
  }

  gl_FragColor = gradedColor;
}
