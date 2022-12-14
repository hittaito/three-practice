uniform float uTime;
uniform sampler2D uHeight;

in vec2 vUv;
out vec4 oColor;

float random(vec2 uv) {
    return fract(sin(uv.x* 2134.+uv.y*732. + 4928. ) * 3202. );
}
float noise(vec2 uv) {
    vec2 gv = fract(uv);
    vec2 id = floor(uv);
    gv = gv*gv*(3. - 2.*gv);

    float n1 = random(id+vec2(0,0));
    float n2 = random(id+vec2(1,0));
    float n3 = random(id+vec2(0,1));
    float n4 = random(id+vec2(1,1));
    float x1 = mix(n1,n2,gv.x);
    float x2 = mix(n3,n4,gv.x);
    return mix(x1,x2,gv.y);
}

float fbm(vec2 x) {
//   float H = 1.;
  float G = .5;//exp2(-H); // Gain係数 1 ~ .5
  float f = 1.;
  float a = .5;
  float t = 0.;
  for (int i=0;i<4;i++) {
    t += a * noise(f * x);
    f *= 2.;
    a *= G;
  }
  return t;
}
float pattern(vec2 p) {
  vec2 q = vec2(fbm(p+vec2(0,0)), fbm(p+vec2(3.4,6.3)));
  return fbm(p+4.*q);
}

// https://github.com/martinRenou/threejs-caustics/blob/master/shaders/simulation/update_fragment.glsl
void main(void) {
    // float time = uTime * .003;
    // vec2 uv = vUv * 3.;
    // float n = pattern(vec2(uv) + vec2(0., time));
    ivec2 uv = ivec2(vUv * vec2(textureSize(uHeight, 0)));
    vec4 height = texelFetch(uHeight, uv, 0);
    float average = (
      texelFetch(uHeight, uv+ivec2(1,0), 0).r +
      texelFetch(uHeight, uv+ivec2(-1,0), 0).r +
      texelFetch(uHeight, uv+ivec2(0,1), 0).r  +
      texelFetch(uHeight, uv+ivec2(0,-1), 0).r
    ) * .25;
    height.g += (average-height.r) * 2.;
    height.g *= 0.97;
    height.r+=height.g;


    oColor = vec4(height.xyz, 1.);
}