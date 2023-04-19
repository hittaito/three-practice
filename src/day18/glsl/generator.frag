uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPrev;
uniform float uTime;
uniform sampler2D uMap1;
uniform sampler2D uMap2;

in vec2 vUv;

layout(location = 0) out vec4 outColor1;
layout(location = 1) out vec4 outColor2;

float rand(float n){return fract(sin(n) * 43758.5453123);}
float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

void main() {
  vec3 col = vec3(0);
  vec2 uv = vUv * uResolution;
  vec2 mouse = uMouse;

  // output values
  vec2 pos = vec2(0);
  vec2 vel = vec2(0);
  float age = 1.;
  float rnd = 0.;
  float size = 0.;

  ivec2 xy = ivec2(gl_FragCoord.xy);
  if (xy.x == 0) {
    col.x = smoothstep(50., 30., length(uv-mouse));
    pos = mouse/uResolution;
    vel = normalize(uPrev - mouse);
    size = noise(uTime * .01);
    rnd = rand(uTime);
  } else {
    vec4 map1 = texelFetch(uMap1, xy-ivec2(1,0), 0);
    vec4 map2 = texelFetch(uMap2, xy-ivec2(1,0), 0);
    pos = map1.xy;
    vel = map1.zw;
    age = map2.x ;
    rnd = map2.y;
    size = map2.z;
  }
  outColor1 = vec4(pos, vel);
  outColor2 = vec4(age, rnd, size, 1.);
}