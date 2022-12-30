var a=Object.defineProperty;var o=(n,e,t)=>e in n?a(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var s=(n,e,t)=>(o(n,typeof e!="symbol"?e+"":e,t),t);import{B as c,e as m,G as h,M as d,S as v,P as q,W as l,s as w}from"./three.module.ae74702b.js";import{O as u}from"./OrbitControls.9335f66a.js";import{S as p,E as z,R as x}from"./SMAAPass.a1f27cfc.js";import"./stats.min.46d05fb3.js";class y{constructor(){s(this,"ui");s(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var g=`in vec2 vUv;

out vec4 oColor;

void main(void) {
    oColor = vec4(vUv,.0, 1.);
}`,f=`uniform float uTime;

out vec2 vUv;

vec4 rotQ(vec3 axis, float rad) {
  vec3 n = normalize(axis);
  float h = rad * .5;
  float s = sin(h);
  return vec4(n * s, cos(h));
}

vec4 conQ(vec4 q) { return vec4(-q.xyz, q.w); }
vec4 mulQ(vec4 q1, vec4 q2) {
  return vec4(q2.w * q1.x - q2.z * q1.y + q2.y * q1.z + q2.x * q1.w,
              q2.z * q1.x + q2.w * q1.y - q2.x * q1.z + q2.y * q1.w,
              -q2.y * q1.x + q2.x * q1.y + q2.w * q1.z + q2.z * q1.w,
              -q2.x * q1.x - q2.y * q1.y - q2.z * q1.z + q2.w * q1.w);
}
vec3 appQ(vec3 v, vec4 q) {
  vec4 vq = vec4(v, 0.);
  vec4 cq = conQ(q);
  vec4 mq = mulQ(mulQ(cq, vq), q);
  return mq.xyz;
}

mat4 lookAt(vec3 eye, vec3 center, vec3 up) {
  vec3 z = normalize(eye - center);
  vec3 x = normalize(cross(up, z));
  vec3 y = cross(z, x);

  return mat4(x.x, y.x, z.x, 0.0, x.y, y.y, z.y, 0.0, x.z, y.z, z.z, 0.0,
              -(eye.x * x.x + eye.y * x.y + eye.z * x.z),
              -(eye.x * y.x + eye.y * y.y + eye.z * y.z),
              -(eye.x * z.x + eye.y * z.y + eye.z * z.z), 1.);
}

void main() {
  vec3 cameraPos = vec3(3. * sin(uTime * .01), 3., 3. * cos(uTime * .01));
  vec3 cameraUp = vec3(0., 1., 0.);

  vec3 axis = vec3(2., 1., 3.);
  float rad = uTime * .01;
  vec4 q = rotQ(axis, rad);
  cameraPos = appQ(cameraPos, q);
  cameraUp = appQ(cameraUp, q);

  
  mat4 vMat = lookAt(cameraPos, vec3(0.), cameraUp);

  vUv = uv;
  gl_Position = projectionMatrix * vMat * modelMatrix * vec4(position, 1.0);
}`;class P{constructor(){s(this,"scene");s(this,"geom");s(this,"mat");s(this,"mesh");const e=new r;this.scene=e.scene,this.setUp()}setUp(){this.geom=new c(1,1),this.mat=new m({fragmentShader:g,vertexShader:f,glslVersion:h,uniforms:{uTime:{value:0}}}),this.mesh=new d(this.geom,this.mat),this.scene.add(this.mesh)}update(){this.mat.uniforms.uTime.value+=1}}class b{constructor(){s(this,"scene");s(this,"camera");s(this,"renderer");s(this,"composer");s(this,"sample");const e=new r;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.composer=e.composer,this.setUp()}setUp(){this.sample=new P;const e=new p(window.innerWidth*this.renderer.getPixelRatio(),window.innerHeight*this.renderer.getPixelRatio());this.composer.addPass(e)}update(){this.sample.update()}resize(){}}let i;class r{constructor(e){s(this,"scene");s(this,"camera");s(this,"renderer");s(this,"composer");s(this,"world");s(this,"size");s(this,"debug");if(i)return i;!e||(i=this,this.init(e))}init(e){this.debug=new y,this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new v,this.camera=new q(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,3),this.renderer=new l({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=w,this.composer=new z(this.renderer);const t=new x(this.scene,this.camera);this.composer.addPass(t),this.world=new b,new u(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.composer.render(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const U=document.querySelector(".webgl"),S=new r(U);window.addEventListener("resize",()=>{S.resize()});
