#version 300 es
precision highp float;

uniform sampler2D lut;
out vec4 fragColor;	
in vec2 mapping;

void main (void) {
  vec4 color  = texture(frame, mapping);
  float green = 1.0 - color.g;

  float xOffset = 0.001953125 + color.r * 0.05859375;
  float zSlice0 = min(floor(color.b * 16.0), 15.0);

  float zSlice1 = min(zSlice0 + 1.0, 15.0);
  float zOffset = mod(color.b * 16.0, 1.0);

  float s0 = xOffset + (zSlice0 * 0.0625);
  float s1 = xOffset + (zSlice1 * 0.0625);

  vec4 slice0Color = texture(lut, vec2(s0, green));
  vec4 slice1Color = texture(lut, vec2(s1, green));

  fragColor = mix(slice0Color, slice1Color, zOffset);
}
