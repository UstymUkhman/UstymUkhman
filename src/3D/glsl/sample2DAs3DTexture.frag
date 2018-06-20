precision highp float;

vec4 sample2DAs3DTexture(sampler2D texture, vec3 uv, float width) {
  float sliceSize = 1.0 / width;
  float innerWidth = width - 1.0;

  float slicePixelSize = sliceSize / width;
  float sliceInnerSize = slicePixelSize * innerWidth;

  float zSlice0 = min(floor(uv.z * width), innerWidth);
  float zSlice1 = min(zSlice0 + 1.0, innerWidth);

  float xOffset = slicePixelSize * 0.5 + uv.x * sliceInnerSize;

  float s0 = xOffset + (zSlice0 * sliceSize);
  float s1 = xOffset + (zSlice1 * sliceSize);

  float yPixelSize = sliceSize;
  float yOffset = yPixelSize * 0.5 + uv.y * (1.0 - yPixelSize);

  vec4 slice0Color = texture2D(texture, vec2(s0, uv.y));
  vec4 slice1Color = texture2D(texture, vec2(s1, uv.y));

  float zOffset = mod(uv.z * width, 1.0);
  return mix(slice0Color, slice1Color, zOffset);
}
