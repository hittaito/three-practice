uniform sampler2D uMap1;
in vec2 vUv;

out vec4 outColor;

void main() {
  vec3 col = vec3(0);
  // col = texture(uMap1, vUv).xyz;
  col = vec3(.32, .29, .91);


  outColor = vec4(col, 1.);
}