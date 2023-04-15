var f=Object.defineProperty;var x=(r,e,n)=>e in r?f(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(x(r,typeof e!="symbol"?e+"":e,n),n);import{d as o,e as c,G as v,M as a,S as u,c as d,P as h,O as p,W as y,s as g}from"./three.module.da3d5bd6.js";import{O as z}from"./OrbitControls.33791f63.js";import"./stats.min.46d05fb3.js";import{F as w}from"./FXAAShader.6da588bf.js";class b{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var m=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,T=`uniform vec2 uMouse;
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

vec3 pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  float f = fbm( p + 4.0*r );

  
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
  return color;
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
  
  return p;

}
float rot(vec3 p) {
  float color = 0.;
  
  p.xy = twirl(p.xy, vec2(2.5));
  
  color += smoothstep(.15,.2,noise(p*10.)); 
  color -= smoothstep(.35,.4,noise(p*10.)); 
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
}`;class P{constructor(){t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new s;this.camera=e.oCamera,this.renderer=e.renderer;const n=new o(2,2),i=new c({vertexShader:m,fragmentShader:T,uniforms:{uTime:{value:0},uType:{value:0}},glslVersion:v});this.mesh=new a(n,i)}render(e){this.mesh.material.uniforms.uType.value=e,this.mesh.material.uniforms.uTime.value+=1,this.renderer.render(this.mesh,this.camera)}}class S{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new s;this.scene=new u,this.camera=e.oCamera,this.renderer=e.renderer;const n=new o(2,2),i=new c({...w});this.mesh=new a(n,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var q=`uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); 
  vec3 Pi1 = Pi0 + vec3(1.0); 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

#define OCTAVES 6
float fbm (in vec3 x) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * cnoise(x);
        x *= 2.;
        amplitude *= .5;
    }
    return value;
}

float pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  return fbm( p + 4.0*r );
}

void main() {
  vec2 uv = vUv * 20.;
  float time = uTime * .01;
  float n = 0.;
  if(uType==0.) n = cnoise(vec3(uv, time*.5));
  if(uType==1.) n = fbm(vec3(uv, time*.1));
  if(uType==2.) n = pattern(vec3(uv*.02, time*.005));
  n = n*.5+.5;
  outColor = vec4(vec3(n), 1.);
}`;class C{constructor(){t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new s;this.camera=e.oCamera,this.renderer=e.renderer;const n=new o(2,2),i=new c({vertexShader:m,fragmentShader:q,uniforms:{uTime:{value:0},uType:{value:0}},glslVersion:v});this.mesh=new a(n,i)}render(e){this.mesh.material.uniforms.uTime.value+=1,this.mesh.material.uniforms.uType.value=e,this.renderer.render(this.mesh,this.camera)}}var _=`uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

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
  vec3 x2 = x0 - i2 + C.yyy; 
  vec3 x3 = x0 - D.yyy;      

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

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
  st += snoise(st*2.) * .1 ; 
  color += smoothstep(.0,.05,snoise(st*10.)); 
  color -= smoothstep(.1,.15,snoise(st*10.)); 
  color += smoothstep(.15,.2,snoise(st*10.)); 
  color -= smoothstep(.35,.4,snoise(st*10.)); 
  color += smoothstep(.8,.85,snoise(st*10.)); 
  color -= smoothstep(.9,.95,snoise(st*10.)); 
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
}`;class A{constructor(){t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new s;this.camera=e.oCamera,this.renderer=e.renderer;const n=new o(2,2),i=new c({vertexShader:m,fragmentShader:_,uniforms:{uTime:{value:0},uType:{value:0}},glslVersion:v});this.mesh=new a(n,i)}render(e){this.mesh.material.uniforms.uTime.value+=1,this.mesh.material.uniforms.uType.value=e,this.renderer.render(this.mesh,this.camera)}}var V=`uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

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

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);
  float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
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

float pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  return fbm( p + 4.0*r );
}

void main() {
  vec2 uv = vUv * 20.;
  float time = uTime * .005;
  float n = 0.;
  if(uType==0.) n = noise(vec3(uv, time));
  if(uType==1.) n = fbm(vec3(uv*.5, time*.5));
  if(uType==2.) n = pattern(vec3(uv*.2, time*.1));
  outColor = vec4(vec3(n), 1.);
}`;class M{constructor(){t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new s;this.camera=e.oCamera,this.renderer=e.renderer;const n=new o(2,2),i=new c({vertexShader:m,fragmentShader:V,uniforms:{uTime:{value:0},uType:{value:0}},glslVersion:v});this.mesh=new a(n,i)}render(e){this.mesh.material.uniforms.uTime.value+=1,this.mesh.material.uniforms.uType.value=e,this.renderer.render(this.mesh,this.camera)}}class O{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"simplex");t(this,"value");t(this,"cell");t(this,"perlin");t(this,"fxaa");const e=new s;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new d(e.size.width,e.size.height),this.setUp()}setUp(){this.simplex=new A,this.value=new M,this.cell=new P,this.perlin=new C,this.fxaa=new S}update(){const e=window.innerWidth/4,n=window.innerHeight/4;this.renderer.setScissor(e*0,n*3,e,n),this.simplex.render(0),this.renderer.setScissor(e*1,n*3,e,n),this.simplex.render(1),this.renderer.setScissor(e*2,n*3,e,n),this.simplex.render(2),this.renderer.setScissor(e*3,n*3,e,n),this.simplex.render(3),this.renderer.setScissor(e*0,n*2,e,n),this.value.render(0),this.renderer.setScissor(e*1,n*2,e,n),this.value.render(1),this.renderer.setScissor(e*2,n*2,e,n),this.value.render(2),this.renderer.setScissor(e*0,n*1,e,n),this.perlin.render(0),this.renderer.setScissor(e*1,n*1,e,n),this.perlin.render(1),this.renderer.setScissor(e*2,n*1,e,n),this.perlin.render(2),this.renderer.setScissor(e*0,n*0,e,n),this.cell.render(0),this.renderer.setScissor(e*1,n*0,e,n),this.cell.render(1),this.renderer.setScissor(e*2,n*0,e,n),this.cell.render(2),this.renderer.setScissor(e*3,n*0,e,n),this.cell.render(3)}resize(){}}let l;class s{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(l)return l;!e||(l=this,this.init(e))}init(e){this.debug=new b,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new u,this.camera=new h(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,3),this.oCamera=new p(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new y({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=g,this.renderer.setScissorTest(!0),this.world=new O,new z(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const U=document.querySelector(".webgl"),E=new s(U);window.addEventListener("resize",()=>{E.resize()});
