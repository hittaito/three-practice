uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

float random(float x) {
  return fract(sin(x*192.28+48.28)*827.92);
}
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f)) * .5-.5;
}


vec2 random(vec2 x) {
  return fract(sin(vec2(
    dot(x, vec2(482.82, 378.27)),
    dot(x, vec2(827.28, 139.89))
  ))*38.2683);
}
float noise(vec3 p) {
  vec2 gv = floor(p.xy);
  vec2 id = fract(p.xy);
  float d = 1.;
  for(int y=-1;y<=1;y++) {
  for(int x=-1;x<=1;x++) {
    vec2 neighbor = vec2(float(x), float(y));
    vec2 point = random(gv+neighbor);
    point += vec2(
      noise(noise(p.x)+p.z+.192),
      noise(noise(p.y)+p.z+23.92)
    );

    float dist = length(neighbor + point - id);
    d = min(d, dist);
  }}
  return d;
}
#define OCTAVES 6
float fbm (in vec3 x) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(x);
        x *= 2.;
        amplitude *= .5;
    }
    return value;
}
// https://gist.github.com/983/e170a24ae8eba2cd174f
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// http://www.iquilezles.org/www/articles/warp/warp.htm
vec3 pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  float f = fbm( p + 4.0*r );

  // color P30
  vec3 color = vec3(0);
  vec3 base = vec3(220., 213., 200.)/255.;
  vec3 accent = vec3(162.,162.,173.)/255.;
  vec3 sub = vec3(31.,30.,99.)/255.;

  base = rgb2hsv(base);
  accent = rgb2hsv(accent);
  sub = rgb2hsv(sub);

  color = mix(base,
              sub,
              clamp(3.*(f*f*f),0.0,1.0));

  color = mix(color,
              accent,
              clamp(dot(q,q),0.0,1.0));

  color = mix(color,
              accent,
              clamp(length(r.x*r.y),0.0,1.0));

  color = hsv2rgb(color);
  return color;// (f*f*f+.6*f*f+.5*f)*color;
}

mat2 r(float a) {
  float s,c;
  s = sin(a);
  c = cos(a);
  return mat2(c,-s,s,c);
}
vec2 twirl(vec2 p, vec2 center) {
  float d = length(p-center);
  float strength = .3;
  float u = d * d*  strength;
  p *= r(u);
  // p = mix(p, p*r(d ), clamp(d*10./(sin(uTime*.01)*.5+.5), 0., 1.));
  return p;

}
float rot(vec3 p) {
  float color = 0.;
  // p.xy = r(noise(p)) * p.xy;
  p.xy = twirl(p.xy, vec2(2.5));
  // p += noise(p*2.) * .1 ; // Animate the coordinate space
  color += smoothstep(.15,.2,noise(p*10.)); // Black splatter
  color -= smoothstep(.35,.4,noise(p*10.)); // Holes on splatter
  return noise(p);
}

void main() {
  vec2 uv = fract(vUv * vec2(4.,4.));
  uv = uv * 5.;
  float time = uTime * .01;
  vec3 n = vec3(0.);
  if(uType==0.) n = vec3(noise(vec3(uv, time*.5)));
  if(uType==1.) n = vec3(fbm(vec3(uv, time*.1)));
  if(uType==2.) n = vec3(pattern(vec3(uv*.02, time*.005)));
  if(uType==3.) n = vec3(rot(vec3(uv , time*.1)));

  outColor = vec4(vec3(n), 1.);
}