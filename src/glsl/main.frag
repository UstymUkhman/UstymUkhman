precision highp float;

#ifndef vignette
#include vignette.glsl;
#endif

#ifndef graded
#include grading.glsl;
#endif

uniform sampler2D tDiffuse;
uniform float     ratio;
uniform sampler2D lut;

out vec4 fragColor;
in vec2  mapping;

void main (void) {
  vec4 color = graded(texture(tDiffuse, mapping), lut);
  fragColor = vignette(color, mapping, ratio);
}
