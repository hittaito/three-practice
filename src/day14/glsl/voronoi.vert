in vec3 origin;
in mat4 uMatrix;
out vec2 vUv;
out vec3 vPos;

void main() {
  vUv = uv;
  vPos = (modelViewMatrix * vec4(origin, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}