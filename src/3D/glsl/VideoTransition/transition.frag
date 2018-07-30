precision highp float;

#include ../utils.glsl;

uniform sampler2D displacement;
uniform sampler2D firstTexture;
uniform sampler2D secondTexture;

uniform float transitionTimer;
uniform vec2  mousePosition;
uniform vec2  resolution;

uniform float maxRadius;
uniform float minRadius;

varying vec2 vTextureCoord;


void main (void) {
  vec4 displacementTexture = texture2D(displacement, vTextureCoord);
  float displacementFactor = (cos(transitionTimer / (90.0 / PI)) + 1.0) / 2.0;

  vec2 secondDisplacementCoords = vec2(vTextureCoord.x - (1.0 - displacementFactor) * (displacementTexture.r * 1.0), vTextureCoord.y);
  vec2 firstDisplacementCoords  = vec2(vTextureCoord.x + displacementFactor * (displacementTexture.r * 1.0), vTextureCoord.y);
  vec2 displacementCoords       = (mousePosition.x < resolution.x / 2.0) ? firstDisplacementCoords : secondDisplacementCoords;

  vec4 displacementColor  = texture2D(displacement, displacementCoords);
  vec4 secondTextureColor = texture2D(secondTexture, vTextureCoord);
  vec4 firstTextureColor  = texture2D(firstTexture, vTextureCoord);

  firstTextureColor = mix(firstTextureColor, displacementColor, displacementFactor);
  firstTextureColor = mix(firstTextureColor, secondTextureColor, displacementFactor);

  float mouseDistance = distance(mousePosition, gl_FragCoord.xy) - minRadius;
  float amount = clamp(mouseDistance / (maxRadius - minRadius), 0.0, 1.0);

  gl_FragColor = mix(firstTextureColor, secondTextureColor, amount);
}
