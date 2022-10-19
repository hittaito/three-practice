
in vec2 iPosition;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out vec2 vWPos;

void main() {
  vUv = uv;
  vWPos = iPosition;
  vNormal = normalMatrix * normal;
  vPosition = (modelMatrix * vec4(position, 1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}