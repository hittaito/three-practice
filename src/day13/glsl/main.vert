
out vec2 vUv;
out vec3 vWorldPos;

void main() {
  vUv = uv;
  vWorldPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}