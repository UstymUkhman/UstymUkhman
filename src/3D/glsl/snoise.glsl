#include mod289.glsl;
#include permute.glsl;

precision highp float;

float snoise (vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;

  x12.xy -= i1;
  i = mod289(i);

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 ox = floor(x + 0.5);
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - ox;
  vec3 g;

  m = m * m;
  m = m * m;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  g.x = a0.x * x0.x + h.x * x0.y;
  return 130.0 * dot(m, g);
}
