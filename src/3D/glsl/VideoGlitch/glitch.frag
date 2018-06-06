#include <common>
#include ...//snoise.glsl;
#include ...//horizontalBlur.frag;

precision highp float;

uniform sampler2D tDiffuse;

uniform float blur;
uniform int lines;

uniform float shift;
uniform float angle;

uniform float distortion;
uniform float speed;

uniform vec3 filterColor;
uniform float amount;
uniform float time;
uniform float snow;
uniform int show;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);

  if (show == 1) {
    vec3 result = color.rgb;
    float lineOpacity = 2.0;
    float yt = vUv.y - time * speed;

    if (snow > 0.0) {
      lineOpacity += 2.0;
    }

    if (shift > 0.0) {
      lineOpacity += 3.0;
    }

    if (lines == 1) {
      float line = sin(vUv.y * 500.0) * 0.2;
      result = color.rgb * vec3(line) * lineOpacity;
      result = color.rgb + 1.0 * (result - color.rgb);
    }

    if (distortion > 0.0) {
      float offset = snoise(vec2(yt * 50.0, 0.0)) * distortion * 0.001;
      vec4 dist = texture2D(tDiffuse, vec2(fract(vUv.x + offset), fract(vUv.y)));
      result = mix(dist.rgb, result, 0.5);
    }

    result = mix(result, horizontalBlur(tDiffuse, vUv, blur).rgb, 0.5);
    result += result * (filterColor * 2.0);
    color = vec4(result, 1.0);

    if (snow > 0.0) {
      float xs = floor(gl_FragCoord.x / snow);
      float ys = floor(gl_FragCoord.y / snow);

      vec2 noise = vec2(xs * time, ys * time);
      color = vec4(result.rgb, 1.0) + vec4(rand(noise) * amount);
    }

    if (shift > 0.0) {
      vec2 offset = shift * vec2(cos(angle), sin(angle));

      vec4 rgbR = texture2D(tDiffuse, vUv + offset);
      vec4 rgbG = texture2D(tDiffuse, vUv);
      vec4 rgbB = texture2D(tDiffuse, vUv - offset);

      vec3 rgb = vec3(rgbR.r, rgbG.g, rgbB.b);
      color = vec4(mix(rgb, color.rgb, 0.5), 1.0);
    }
  }

  gl_FragColor = color;
}
