uniform float uTime;

in vec2 vUv;

layout(location = 0) out vec4 oColor;

float random(vec2 uv) {
    return fract(sin(uv.x* 2134.+uv.y*732. + 4928. ) * 3202. );
}
float map(float x, float b1, float b2, float a1, float a2) {
  float p = (x-b1)/(b2-b1);
  return p * a2 + (1. - p) * a1;
}

void main(void) {
  vec2 uv = vUv;
  uv *= 20.;
  float time = uTime * .007;
  vec3 col = vec3(0);
  vec2 id = floor(uv);
  float rnd = random(id.xx);
  uv.y += rnd + 15. * (sin(rnd * 10. + time) * .5 + .5) ;
  float y = sin(uv.y * 5.3) * sin(uv.y * 2.9 + 12.) * .5 +.5;
  col.y = step(.8, y);

  float thickness = .02;
  float center = map(sin(time), -1., 1., .1, .6) ;
  col += vec3(192.,48., 192.) / 255. * smoothstep(center - thickness, center, y) * smoothstep(center + thickness, center, y);

  oColor = vec4(col, 1.);
}