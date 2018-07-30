precision highp float;

#define E       2.718281828459045
#define PI      3.141592653589793
#define PI2     6.283185307179586
#define PI_2    1.570796326794897
#define LOG2    1.442695040888963
#define LOG10   0.434294481903252
#define SQRT2   1.414213562373095
#define SQRT_2  0.707106781186548

float pow2 (const in float x) {
  return x * x;
}

float pow3 (const in float x) {
  return x * x * x;
}

float pow4 (const in float x) {
  float x2 = pow2(x);
  return x2 * x2;
}

float average2 (const in vec2 value) {
  return dot(value, vec2(0.333333333333333));
}

float average4 (const in vec3 value) {
  return dot(value, vec3(0.333333333333333));
}

float average4 (const in vec4 value) {
  return dot(value, vec4(0.333333333333333));
}

// glsl-random by mattdesl:
// https://github.com/mattdesl/glsl-random
float random (vec2 co) {
  highp float a  = 12.9898;
  highp float b  = 78.233;
  highp float c  = 43758.5453;

  highp float dt = dot(co.xy ,vec2(a,b));
  highp float sn = mod(dt,3.14);
  return fract(sin(sn) * c);
}
