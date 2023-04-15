in float vDist1;
in float vDist2;
in float vDist3;
in vec3 vXYZ;

out vec4 outColor;

float invMap(float a, float b, float x) {
  return 1. - min(1., abs(x-a)/abs(b-a));
}

void main(void) {
  vec3 col = vec3(0.);
  vec3 col1 = vec3(.68, .19, .69);
  vec3 col2 = vec3(.93, 1., .59);
  vec3 col3 = vec3(.07, .10, .51);
  col += invMap(0., 30., vDist1) * col1;
  col += invMap(0., 15., vDist2) * col2;
  col += invMap(0., 20., vDist3) * col3;
  col += invMap(50., 0., vDist1) * vec3(1.);
  col = vXYZ;
  outColor = vec4(col,1.);
}