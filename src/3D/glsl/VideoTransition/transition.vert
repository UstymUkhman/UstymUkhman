precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform vec2 planeCoords;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float strength;
uniform float ratio;
uniform float time;

varying vec2 vTextureCoord;


void main (void) {
  vec3 vertexPosition = aVertexPosition;

  float distanceFromMouse = distance(planeCoords, vec2(vertexPosition.x, vertexPosition.y));
  float waveSinusoid = cos(5.0 * (distanceFromMouse - time / 75.0));

  float verticalDistance   = planeCoords.y - vertexPosition.y;
  float horizontalDistance = (planeCoords.x - vertexPosition.x) * ratio;

  float distanceStrength = (0.4 / (distanceFromMouse + 0.2));
  float distortionEffect = distanceStrength * -waveSinusoid * strength;

  vertexPosition.z += distortionEffect / 15.0;
  vertexPosition.y += distortionEffect / 15.0 * verticalDistance;
  vertexPosition.x += distortionEffect / 15.0 * horizontalDistance;

  gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
}
