// https://github.com/delaneyj/three.net/blob/fbfb02ee0a547c597149fda16c9666135ba6d02f/code/js/r68/examples/js/shaders/FresnelShader.js

uniform float uRefractionRatio;
uniform float uFresnelBias;
uniform float uFresnelScale;
uniform float uFresnelPower;

out vec3 vReflect;
out vec3 vRefract[3];
out float vReflectionFactor;

void main() {
  float mRefractionRatio = uRefractionRatio;
  float mFresnelBias = uFresnelBias;
  float mFresnelScale = uFresnelScale;
  float mFresnelPower = uFresnelPower;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec3 worldNormal = normalize(
      mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) *
      normal);

  vec3 I = worldPosition.xyz - cameraPosition;

  vReflect = reflect(I, worldNormal);
  vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio);
  vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.99);
  vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.98);
  vReflectionFactor =
      mFresnelBias +
      mFresnelScale * pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);

  gl_Position = projectionMatrix * mvPosition;
}