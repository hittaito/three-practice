var y=Object.defineProperty;var z=(r,e,t)=>e in r?y(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var n=(r,e,t)=>(z(r,typeof e!="symbol"?e+"":e,t),t);import{S as h,d as l,e as c,M as v,c as f,G as x,B as p,I as P,q as b,D as C,P as _,O as R,W as S,s as M}from"./three.module.9352233f.js";import{O as I}from"./OrbitControls.e80330a0.js";import"./stats.min.46d05fb3.js";import{F as U}from"./FXAAShader.0b4b74a1.js";class D{constructor(){n(this,"ui");n(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class T{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");const e=new o;this.scene=new h,this.camera=e.oCamera,this.renderer=e.renderer;const t=new l(2,2),i=new c({...U});this.mesh=new v(t,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,t){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=t,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}class A{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");const e=new o;this.scene=new h,this.camera=e.oCamera,this.renderer=e.renderer;const t=new l(2,2),i=new c({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, vUv);
            }`,uniforms:{tDiffuse:{value:null}}});this.mesh=new v(t,i),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDiffuse.value=e,this.renderer.render(this.scene,this.camera)}}var G=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,W=`uniform float uTime;

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
float map(float x1, float x2, float y1, float y2, float t) {
  return (y2-y1)/(x2-x1) * (t-x1) + y1;
}

float easeInOutCubic(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t * t;
    } else {
        return 0.5 * ((t -= 2.0) * t * t + 2.0);
    }
}

void main() {
  float time = uTime * .01;
  float t1= sin(time);
  float t2 = cos(t1*2.1+.8) ;
  float scale = map(-1., 1., 2.5, 15., t2);
  vec2 uv = (vUv -.5) * scale;

  float n = cnoise(vec3(uv, time* 2.));
  n = n * .5+.5;
  outColor = vec4(vec3(n), 1.);
}`;class q{constructor(){n(this,"camera");n(this,"renderer");n(this,"mesh");n(this,"target");const e=new o;this.camera=e.oCamera,this.renderer=e.renderer,this.target=new f(e.size.width,e.size.height);const t=new l(2,2),i=new c({vertexShader:G,fragmentShader:W,uniforms:{uTime:{value:0}},glslVersion:x});this.mesh=new v(t,i)}get texture(){return this.target.texture}render(){this.mesh.material.uniforms.uTime.value+=1,this.renderer.setRenderTarget(this.target),this.renderer.render(this.mesh,this.camera)}}var F=`uniform sampler2D uMap;
uniform float uRow;
uniform float uColumn;

in float iId;

out vec2 vUv;
out float vId;
out vec3 vCol;

void main() {
  vUv = uv;
  vId = iId;
  vec3 pos = position;

  float col = uColumn;
  float row = uRow;

  vec2 xy = vec2(
    mod(iId, col),
    floor(iId/col)
  ) / vec2(col, row);
  float h = texture(uMap, xy).x;
  vCol = vec3(.3, .7, 0.);
  vec3 p = vec3(xy , 0.) - vec3(.5, .5, 0.);
  pos *= (1.-h) * 5.;
  pos += p * 30.;
  pos.z+=h *3.3;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
}`,L=`in vec2 vUv;
in vec3 vCol;

out vec4 oColor;

void main(void) {
    oColor = vec4(vCol, 1.);
}`;class V{constructor(e=100,t=30){n(this,"scene");n(this,"mesh");const i=new o;this.scene=i.scene;const m=new p(.02,.02,.02),s=new P,d=e*t;s.instanceCount=d,s.index=m.index,s.attributes=m.attributes;const u=new Float32Array(d);for(let a=0;a<d;a++)u[a]=a;s.setAttribute("iId",new b(u,1)),console.log(s);const w=new c({vertexShader:F,fragmentShader:L,glslVersion:x,side:C,uniforms:{uRow:{value:e},uColumn:{value:t},uMap:{value:null}}});this.mesh=new v(s,w),this.scene.add(this.mesh)}update(e){this.mesh.material.uniforms.uMap.value=e}}class B{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"target");n(this,"sample");n(this,"points");n(this,"noise");n(this,"view");n(this,"fxaa");const e=new o;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new f(e.size.width,e.size.height),this.setUp()}setUp(){this.points=new V,this.noise=new q,this.view=new A,this.fxaa=new T}update(){this.noise.render(),this.points.update(this.noise.texture),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)}resize(){}}let g;class o{constructor(e){n(this,"scene");n(this,"camera");n(this,"oCamera");n(this,"renderer");n(this,"world");n(this,"size");n(this,"debug");if(g)return g;!e||(g=this,this.init(e))}init(e){this.debug=new D,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new h,this.camera=new _(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,3),this.oCamera=new R(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new S({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=M,this.world=new B,new I(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const O=document.querySelector(".webgl"),j=new o(O);window.addEventListener("resize",()=>{j.resize()});
