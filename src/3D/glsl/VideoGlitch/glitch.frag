#include <common>
#include ../blur.frag;
#include ../snoise.glsl;

precision highp float;

uniform sampler2D tDiffuse;

uniform float distortion;
uniform float speed;

uniform float shift;
uniform float angle;

uniform vec3 overlay;
uniform float noise;
uniform float blur;

uniform float time;
uniform int lines;

varying vec2 vUv;

void main (void) {
  float blurStrength = blur * 5.0 / 512.0;
  vec4 color = texture2D(tDiffuse, vUv);
  vec3 result = color.rgb;

  vec4 vBlur = verticalBlur(tDiffuse, vUv, blurStrength);
  vec4 hBlur = horizontalBlur(tDiffuse, vUv, blurStrength);

  result.r = (result.r + hBlur.r + vBlur.r) / 3.0;
  result.g = (result.g + hBlur.g + vBlur.g) / 3.0;
  result.b = (result.b + hBlur.b + vBlur.b) / 3.0;

  float offset = snoise(vec2((vUv.y - time * speed) * 10.0, 0.0)) * distortion * 0.05;
  vec4 dist = texture2D(tDiffuse, vec2(fract(vUv.x + offset), fract(vUv.y + offset * 2.0)));

  float amount = 0.5 - blur / 2.0 + distortion / 2.0;
  result = mix(result, dist.rgb, amount);
  result += result * (overlay * 2.0);

  float xs = floor(gl_FragCoord.x / 1.0);
  float ys = floor(gl_FragCoord.y / 1.0);

  vec2 noisePosition = vec2(xs * time, ys * time);
  vec3 noiseColor = vec4(rand(noisePosition) * noise * 2.0).rgb;

  color.rgb = mix(result, noiseColor, noise / 4.0);

  if (shift > 0.0) {
    vec2 offset = shift * vec2(cos(angle), sin(angle));

    vec4 rgbR = texture2D(tDiffuse, vUv + offset);
    vec4 rgbG = texture2D(tDiffuse, vUv);
    vec4 rgbB = texture2D(tDiffuse, vUv - offset);

    vec3 rgb = vec3(rgbR.r, rgbG.g, rgbB.b);
    color = vec4(mix(rgb, color.rgb, 0.5), 1.0);
  }

  if (lines == 1) {
    float line = sin(vUv.y * 750.0) * 0.5;
    result = color.rgb * vec3(line) * 3.0;
    result = color.rgb + 1.0 * (result - color.rgb);
    color = vec4(result.rgb, 1.0);
  }

  gl_FragColor = color;
}
