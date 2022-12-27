
in vec2 vUv;

layout(location = 0) out vec4 oPosition;
layout(location = 1) out vec4 oVelocity;

float random(vec2 uv) {
    float r = fract(sin(uv.x* 2134.+uv.y*732. + 4928. ) * 3202. );
    return 2. * r -1.;
}

void main(void) {
  vec3 pos, vel;
  vec2 uv = vec2(gl_FragCoord.x, 0);

  pos = vec3(
    random(uv),
    random(uv + vec2(23.34,54.23)),
    random(uv + vec2(98.93, 12.34))
  ) * 10.;
  vel = normalize(vec3(
    random(uv),
    random(uv + vec2(3.3224,4.2323)),
    random(uv + vec2(8.93, 822.34))
  ) );
  oPosition = vec4(pos, 1.);
  oVelocity = vec4(vel,1.);
}