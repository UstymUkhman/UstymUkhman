// THREE.js Vertical and Horizontal blur shaders:
// https://github.com/mrdoob/three.js/blob/dev/examples/js/shaders/VerticalBlurShader.js
// https://github.com/mrdoob/three.js/blob/dev/examples/js/shaders/HorizontalBlurShader.js

precision highp float;

vec4 verticalBlur (sampler2D diffuse, vec2 uv, float depth) {
  vec4 sum = vec4(0.0);

  sum += texture2D(diffuse, vec2(uv.x, uv.y - 4.0 * depth)) * 0.051;
  sum += texture2D(diffuse, vec2(uv.x, uv.y - 3.0 * depth)) * 0.0918;
  sum += texture2D(diffuse, vec2(uv.x, uv.y - 2.0 * depth)) * 0.12245;
  sum += texture2D(diffuse, vec2(uv.x, uv.y - 1.0 * depth)) * 0.1531;

  sum += texture2D(diffuse, vec2(uv.x, uv.y)) * 0.1633;

  sum += texture2D(diffuse, vec2(uv.x, uv.y + 1.0 * depth)) * 0.1531;
  sum += texture2D(diffuse, vec2(uv.x, uv.y + 2.0 * depth)) * 0.12245;
  sum += texture2D(diffuse, vec2(uv.x, uv.y + 3.0 * depth)) * 0.0918;
  sum += texture2D(diffuse, vec2(uv.x, uv.y + 4.0 * depth)) * 0.051;

  return sum;
}

vec4 horizontalBlur (sampler2D diffuse, vec2 uv, float depth) {
  vec4 sum = vec4(0.0);

  sum += texture2D(diffuse, vec2(uv.x - 4.0 * depth, uv.y)) * 0.051;
  sum += texture2D(diffuse, vec2(uv.x - 3.0 * depth, uv.y)) * 0.0918;
  sum += texture2D(diffuse, vec2(uv.x - 2.0 * depth, uv.y)) * 0.12245;
  sum += texture2D(diffuse, vec2(uv.x - 1.0 * depth, uv.y)) * 0.1531;

  sum += texture2D(diffuse, vec2(uv.x, uv.y)) * 0.1633;

  sum += texture2D(diffuse, vec2(uv.x + 1.0 * depth, uv.y)) * 0.1531;
  sum += texture2D(diffuse, vec2(uv.x + 2.0 * depth, uv.y)) * 0.12245;
  sum += texture2D(diffuse, vec2(uv.x + 3.0 * depth, uv.y)) * 0.0918;
  sum += texture2D(diffuse, vec2(uv.x + 4.0 * depth, uv.y)) * 0.051;

  return sum;
}
