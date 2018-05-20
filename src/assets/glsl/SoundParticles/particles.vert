precision highp float;

attribute vec3 startPosition;
attribute vec3 endPosition;
attribute float index;

uniform float frequencies[1024];
uniform float easing;
uniform float time;

uniform mat4 proj;
uniform mat4 view;

varying vec4 vColor;

void main(void) {
  int i = int(index);
  float frequency = frequencies[i];

  vec3 startPos = startPosition;
  vec3 endPos = endPosition;

  bool animate = easing < 0.0 || easing > 0.0;

  if (animate) {
    float animate = 1.0 + (time - 40.8) / 2.0;
    startPos /= animate;
    endPos /= animate;

    if (easing > 0.0) {
      float diff = 1.0 + (time - easing);
      startPos *= diff;
      endPos *= diff;
    }
  }

  if (time > 48.5) {
    startPos *= 2.0;
    endPos = startPos * 2.0;
  }

  vec3 dist = (endPos - startPos) * frequency;
  vec3 pos = startPos + dist;
  const float dark = 0.4;

  vec3 color = vec3(
    pos.y + dark - pos.x * dark,
    pos.z + dark - pos.y * dark,
    pos.x + dark - pos.z * dark
  );

  gl_Position = proj * view * vec4(pos, 1.0);
  gl_PointSize = 25.0 * frequency + 8.0;
  vColor = vec4(color, 1.0);
}
