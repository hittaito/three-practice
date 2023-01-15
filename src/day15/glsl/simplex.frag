uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

// https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}
vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;


  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

#define OCTAVES 6
float fbm (in vec3 x) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise(x);
        x *= 2.;
        amplitude *= .5;
    }
    return value;
}
// http://www.iquilezles.org/www/articles/warp/warp.htm
float pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  return fbm( p + 4.0*r );
}
float add(vec3 p) {
  vec3 st = vec3(p.xy,p.z);
  float color = 0.;
  st += snoise(st*2.) * .1 ; // Animate the coordinate space
  color += smoothstep(.0,.05,snoise(st*10.)); // Black splatter
  color -= smoothstep(.1,.15,snoise(st*10.)); // Holes on splatter
  color += smoothstep(.15,.2,snoise(st*10.)); // Black splatter
  color -= smoothstep(.35,.4,snoise(st*10.)); // Holes on splatter
  color += smoothstep(.8,.85,snoise(st*10.)); // Black splatter
  color -= smoothstep(.9,.95,snoise(st*10.)); // Holes on splatter
  return 1. - color;
}


void main() {
  vec2 uv = fract(vUv * vec2(4.,4.));
  uv = uv * 5.;
  float time = uTime * .001;
  float n = 0.;


  if(uType==0.) n = snoise(vec3(uv, time));
  if(uType==1.) n = fbm(vec3(uv, time));
  if(uType==2.) n = pattern(vec3(uv*.02, time*.01));
  if(uType==3.) n = add(vec3(uv*.1, time*.1));

  n = n*.5+.5;
  outColor = vec4(vec3(n), 1.);
}