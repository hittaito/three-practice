uniform sampler2D uMap;
in vec2 vUv;

out vec4 outColor;

void main() {
  vec3 col = vec3(0);
  vec4 diffuse = texture(uMap, vUv);
  diffuse.a = min(1., diffuse.a*80.-10.);

  // outColor = vec4(col, 1.);
  outColor = diffuse;
}