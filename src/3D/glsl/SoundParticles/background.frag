#include ...//random.glsl;

precision highp float;

uniform float progress;
uniform float aspect;
uniform bool dark;

varying vec2 vUv;

void main (void) {
  const vec3 white = vec3(0.8, 0.8, 0.8);
  const vec3 black = vec3(0.0, 0.0, 0.0);

  vec2 smoothing = vec2(-0.4, 0.8);
  vec2 offset = vec2(0.0, 0.0);
  vec2 scale = vec2(1.0, 1.0);
  vec2 pos = vUv;

  pos   -= 0.5;
  pos.x *= aspect;
  pos   /= scale;
  pos   -= offset;

  float dist = length(pos);
  float prog = 0.0;

  if (progress > 5.3) {
    if (dark) {
      prog = (progress - 5.3) / 100.0 + 0.1;
    } else {
      prog = 0.75;
    }
  }

  vec3 centerColor = prog * white;
  vec4 color = vec4(1.0);

  dist = smoothstep(smoothing.x, smoothing.y, 1.0 - dist);
  color.rgb = mix(black, centerColor, dist);

  vec3 noise = vec3(random(vUv * 1.5), random(vUv * 2.5), random(vUv));
  gl_FragColor = color;
}
