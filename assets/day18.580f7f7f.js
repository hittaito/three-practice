var z=Object.defineProperty;var b=(r,e,n)=>e in r?z(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(b(r,typeof e!="symbol"?e+"":e,n),n);import{S as g,d as h,e as u,M as l,u as C,F as R,G as m,V as o,a5 as y,I as S,q as T,c as x,O as p,W as P,s as F}from"./three.module.9352233f.js";import"./stats.min.46d05fb3.js";import{F as U}from"./FXAAShader.0b4b74a1.js";class _{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class D{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const n=new h(2,2),i=new u({...U});this.mesh=new l(n,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var d=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,H=`uniform vec2 uResolution;
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
}`;class W{constructor(e){t(this,"camera");t(this,"renderer");t(this,"targets");t(this,"active",0);t(this,"mesh");const n=new a;this.camera=n.oCamera,this.renderer=n.renderer;const i=new C(e,1,2,{type:R});this.targets=[i,i.clone()];const s=new h(2,2),c=new u({vertexShader:d,fragmentShader:H,glslVersion:m,uniforms:{uMouse:{value:new o(0,0)},uResolution:{value:new o(0,0)},uPrev:{value:new o(1,0)},uTime:{value:0},uMap1:{value:null},uMap2:{value:null}}});this.mesh=new l(s,c)}get textures(){return this.targets[this.active].texture}get invTarget(){return this.targets[1-this.active]}generate(){this.mesh.material.uniforms.uTime.value+=Math.random()*100,this.mesh.material.uniforms.uMap1.value=this.targets[1-this.active].texture[0],this.mesh.material.uniforms.uMap2.value=this.targets[1-this.active].texture[1],this.renderer.setRenderTarget(this.targets[this.active]),this.renderer.render(this.mesh,this.camera),this.active=1-this.active}update(e){this.mesh.material.uniforms.uPrev.value.setX(this.mesh.material.uniforms.uMouse.value.x),this.mesh.material.uniforms.uPrev.value.setY(this.mesh.material.uniforms.uMouse.value.y),this.mesh.material.uniforms.uMouse.value.setX(e.clientX),this.mesh.material.uniforms.uMouse.value.setY(window.innerHeight-e.clientY)}resize(){this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth),this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight)}inv(){this.active=1-this.active}}var G=`uniform sampler2D uMap1; 
uniform sampler2D uMap2; 
uniform vec2 uResolution;

in float iId;

out vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  vec4 map1 = texelFetch(uMap1, ivec2(gl_InstanceID, 0), 0);
  vec4 map2 = texelFetch(uMap2, ivec2(gl_InstanceID, 0), 0);
  
  float r = uResolution.x/uResolution.y;
  pos += (map1.xyz+ map2.xyz + iId) * .0;
  pos *= max(0., map2.z - map2.x/1000.);
  pos.xy += (map1.xy * 2. -1.) * vec2(r,1.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,I=`uniform sampler2D uMap1;
in vec2 vUv;

out vec4 outColor;

void main() {
  vec3 col = vec3(0);
  
  col = vec3(.32, .29, .91);

  outColor = vec4(col, 1.);
}`;class X{constructor(e){t(this,"renderer");t(this,"scene");t(this,"mesh");const n=new a;this.scene=n.scene,this.renderer=n.renderer;const i=new y(.3,36),s=new S;s.instanceCount=e,s.index=i.index,s.attributes=i.attributes;const c=new Float32Array(e);for(let v=0;v<e;v++)c[v]=v;s.setAttribute("iId",new T(c,1));const M=new u({vertexShader:G,fragmentShader:I,glslVersion:m,uniforms:{uMap1:{value:null},uMap2:{value:null},uResolution:{value:new o(0,0)}}});this.mesh=new l(s,M),this.scene.add(this.mesh)}update(e){this.mesh.material.uniforms.uMap1.value=e[0],this.mesh.material.uniforms.uMap2.value=e[1]}resize(){this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth),this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight)}}var V=`uniform vec2 uResolution;
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

  
  vec2 pos = vec2(0);
  vec2 vel = vec2(0);
  float age = 1.;
  float rnd = 0.;
  float size = 0.;

  ivec2 xy = ivec2(gl_FragCoord.xy);

  vec4 map1 = texelFetch(uMap1, xy, 0);
  vec4 map2 = texelFetch(uMap2, xy, 0);

  float r1 =rand(map2.z) * 2.-1.;
  float r2 = rand(r1 * 324.23)*2.-1.;

  vec2 diff = normalize(vec2(r1, r2)) * 5.;
  pos = map1.xy + (normalize(map1.zw + diff) * .003  );
  vel = map1.zw;
  age = map2.x + 1.;
  rnd = map2.y;
  size = map2.z;

  outColor1 = vec4(pos, vel);
  outColor2 = vec4(age, rnd, size, 1.);
}`;class A{constructor(e){t(this,"camera");t(this,"renderer");t(this,"mesh");const n=new a;this.camera=n.oCamera,this.renderer=n.renderer;const i=new h(2,2),s=new u({vertexShader:d,fragmentShader:V,glslVersion:m,uniforms:{uMouse:{value:new o(0,0)},uResolution:{value:new o(0,0)},uPrev:{value:new o(1,0)},uTime:{value:0},uMap1:{value:null},uMap2:{value:null}}});this.mesh=new l(i,s)}render(e,n){this.mesh.material.uniforms.uTime.value+=1,this.mesh.material.uniforms.uMap1.value=e[0],this.mesh.material.uniforms.uMap2.value=e[1],this.renderer.setRenderTarget(n),this.renderer.render(this.mesh,this.camera)}update(e){this.mesh.material.uniforms.uPrev.value.setX(this.mesh.material.uniforms.uMouse.value.x),this.mesh.material.uniforms.uPrev.value.setY(this.mesh.material.uniforms.uMouse.value.y),this.mesh.material.uniforms.uMouse.value.setX(e.clientX),this.mesh.material.uniforms.uMouse.value.setY(window.innerHeight-e.clientY)}resize(){this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth),this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight)}}var Y=`uniform sampler2D uMap;
in vec2 vUv;

out vec4 outColor;

void main() {
  vec3 col = vec3(0);
  vec4 diffuse = texture(uMap, vUv);
  diffuse.a = min(1., diffuse.a*80.-10.);

  
  outColor = diffuse;
}`;class L{constructor(){t(this,"renderer");t(this,"camera");t(this,"mesh");const e=new a;this.renderer=e.renderer,this.camera=e.oCamera;const n=new h(2,2),i=new u({vertexShader:d,fragmentShader:Y,glslVersion:m,uniforms:{uMap:{value:null}},transparent:!0});this.mesh=new l(n,i)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.uMap.value=n,this.renderer.render(this.mesh,this.camera)}}var k=`uniform sampler2D uMap;
uniform bool uHorizon;
uniform int uStep;

in vec2 vUv;

out vec4 outColor;

const float[5] w = float[](0.2270270, 0.1945945, 0.1216216, 0.0540540, 0.0162162);

ivec2 clampCoord(ivec2 coord, ivec2 size) {
    return max(min(coord, size - 1), 0);
}

void main(void) {
  ivec2 texSize = ivec2(gl_FragCoord.xy);
  ivec2 size = textureSize(uMap, 0);
  vec4 color = texelFetch(uMap, texSize, 0);
  vec4 sum = w[0] * color * color.a;
  sum.a = w[0] * color.a;

  for (int i = 1; i < 5; i++) {
    ivec2 offset = (uHorizon ? ivec2(i, 0) : ivec2(0, i)) * uStep;
    color = texelFetch(uMap, clampCoord(texSize + offset, size), 0);
    sum.rgb += w[i] * color.rgb * color.a;
    sum.a += w[i] * color.a;
    color = texelFetch(uMap, clampCoord(texSize - offset, size), 0);
    sum.rgb += w[i] * color.rgb * color.a;
    sum.a += w[i] * color.a;
  }
  float a = sum.a == 0. ? 0. : 1.;
  outColor = vec4(sum.rgb/sum.a, sum.a);
}`;class E{constructor(){t(this,"renderer");t(this,"targets");t(this,"camera");t(this,"active",0);t(this,"mesh");const e=new a;this.camera=e.oCamera,this.renderer=e.renderer;const n=new x(e.size.width,e.size.height);this.targets=[n,n.clone()];const i=new h(2,2),s=new u({vertexShader:d,fragmentShader:k,glslVersion:m,uniforms:{uMap:{value:null},uStep:{value:0},uHorizon:{value:!1}}});this.mesh=new l(i,s)}get texture(){return this.targets[this.active].texture}render(e){this.mesh.material.uniforms.uMap.value=e;for(let n=0;n<8;n++)this.mesh.material.uniforms.uStep.value=Math.floor(n/2)+1,this.renderer.setRenderTarget(this.targets[1-this.active]),this.mesh.material.uniforms.uHorizon.value=this.active===0,this.renderer.render(this.mesh,this.camera),this.active=1-this.active,this.mesh.material.uniforms.uMap.value=this.targets[this.active].texture}}const f=300;class q{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"sample");t(this,"generator");t(this,"updater");t(this,"viewer");t(this,"bokeh");t(this,"total");t(this,"fxaa");const e=new a;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new x(e.size.width,e.size.height),this.setUp(),this.setUpEvent()}setUp(){this.generator=new W(f),this.updater=new A(f),this.viewer=new X(f),this.bokeh=new E,this.total=new L,this.fxaa=new D,this.generator.generate()}update(){this.generator.inv(),this.updater.render(this.generator.textures,this.generator.invTarget),this.viewer.update(this.generator.textures),this.renderer.setRenderTarget(this.target),this.renderer.render(this.scene,this.camera),this.bokeh.render(this.target.texture),this.total.render(null,this.bokeh.texture)}resize(){this.generator.resize(),this.viewer.resize()}setUpEvent(){const e=document.querySelector("canvas");!e||(e.addEventListener("mousemove",n=>{this.generator.update(n)}),this.resize(),setInterval(()=>{Math.random()>.4&&this.generator.generate()},110))}}let w;class a{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(w)return w;!e||(w=this,this.init(e))}init(e){this.debug=new _,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new g;const n=this.size.width/this.size.height;this.camera=new p(-n,n,1,-1,1,10),this.camera.position.set(0,0,3),this.oCamera=new p(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new P({alpha:!0,antialias:!0}),this.renderer.setClearColor(0,0),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=F,console.log(this.renderer),e.appendChild(this.renderer.domElement),this.world=new q,this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.renderer.setSize(this.size.width,this.size.height),this.world.resize()}}const B=document.querySelector(".webgl"),O=new a(B);window.addEventListener("resize",()=>{O.resize()});
