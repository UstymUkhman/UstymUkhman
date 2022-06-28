#ifndef rand
#include <common>
#endif

highp vec3 blend (const in vec3 base, const in vec3 blend) {
  return mix(
    1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
    2.0 * base * blend,
    step(base, vec3(0.5))
  );
}

highp vec4 vignette (
  inout vec4 color,
  const in vec2 uv,
  const in float ratio
) {
  vec2 pos = uv;
  pos     -= 0.5;
  pos.x   *= ratio;

  color.rgb = mix(
    vec3(0.0), color.rgb, smoothstep(
      -0.5, 0.4, 1.0 - length(pos)
    )
  );

  color.rgb = mix(
    color.rgb, blend(color.rgb, vec3(
      rand(uv * 0.1), rand(uv * 2.5), rand(uv)
    )), 0.05
  );

  return color;
}
