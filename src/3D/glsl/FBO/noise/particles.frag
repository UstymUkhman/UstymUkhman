#include ...//...//curl.glsl;

precision highp float;

uniform sampler2D texture;

uniform float distance;
uniform float speed;
uniform float timer;

varying vec2 vUv;

void main (void) {
  vec3 position = texture2D(texture, vUv).xyz;

  vec3 tar = position + curl(
    position.x, position.y, position.z, timer
  ) * speed;

  float d = length(position - tar) / distance;
  position = mix(position, tar, pow(d, 5.0));

  gl_FragColor = vec4(position, 1.0);
}
