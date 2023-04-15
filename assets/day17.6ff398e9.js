var y=Object.defineProperty;var z=(i,e,n)=>e in i?y(i,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[e]=n;var t=(i,e,n)=>(z(i,typeof e!="symbol"?e+"":e,n),n);import{S as g,d as p,e as m,M as u,B as P,I as C,q as D,G as f,D as T,c as q,t as w,P as S,O as M,W as R,s as Q}from"./three.module.da3d5bd6.js";import{O as X}from"./OrbitControls.33791f63.js";import"./stats.min.46d05fb3.js";import{F as A}from"./FXAAShader.6da588bf.js";class G{constructor(){t(this,"ui");t(this,"stats");t(this,"status","OFF")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class U{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const n=new p(2,2),s=new m({...A});this.mesh=new u(n,s),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var F=`#define PI acos(-1.)

uniform float uSide;
uniform sampler2D uTexture;

in vec3 iParam;

out vec2 vUv;
out vec3 vXYZ;
out float vDist1;
out float vDist2;
out float vDist3;

mat2 rot(float a) {
  float s,c;
  s = sin(a);
  c = cos(a);
  return mat2(c,-s,s,c);
}

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

void main() {
  vUv = uv;
  vXYZ = iParam / uSide;
  vec4 map1 = texture(uTexture, vXYZ.xy);
  vec4 map2 = texture(uTexture, vXYZ.yz);
  vec4 map3 = texture(uTexture, vXYZ.zx);
  vec3 pos = position;

  float gap = 1.2;
  vec3 dist = (iParam - vec3(uSide * .5)) * gap;
  vec4 q1 = rotQ(normalize(map1.xyz -.5), map1.w * 2. * PI * 1.5);
  vec4 q2 = rotQ(normalize(map2.xyz -.5), map2.w * 2. * PI * 1.);
  vec4 q = mulQ(q1,q2);
  pos = appQ(pos, q); 
  pos *= (1. - min(1., length((vXYZ-.5)*2.))) * 2.4; 
  pos += map1.xyz * 1.5;
  pos += map2.xyz * 1.9;
  pos += map3.xyz * 2.;
  pos += dist;
  vDist1 = length(dist);
  vDist2 = length(dist-vec3(0., 15., 0.));
  vDist3 = length(dist-vec3(0., 0., 15.));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1);
}`,Y=`in float vDist1;
in float vDist2;
in float vDist3;
in vec3 vXYZ;

out vec4 outColor;

float invMap(float a, float b, float x) {
  return 1. - min(1., abs(x-a)/abs(b-a));
}

void main(void) {
  vec3 col = vec3(0.);
  vec3 col1 = vec3(.68, .19, .69);
  vec3 col2 = vec3(.93, 1., .59);
  vec3 col3 = vec3(.07, .10, .51);
  col += invMap(0., 30., vDist1) * col1;
  col += invMap(0., 15., vDist2) * col2;
  col += invMap(0., 20., vDist3) * col3;
  col += invMap(50., 0., vDist1) * vec3(1.);
  col = vXYZ;
  outColor = vec4(col,1.);
}`;const r=20,x=r*r*r;class Z{constructor(){t(this,"scene");t(this,"mesh");const e=new a;this.scene=e.scene;const n=new P(1,1,1),s=new C;s.instanceCount=x,s.index=n.index,s.attributes=n.attributes;const o=new Float32Array(x*3);let c=0;for(let l=0;l<r;l++)for(let h=0;h<r;h++)for(let d=0;d<r;d++)o[c+0]=l,o[c+1]=h,o[c+2]=d,c+=3;s.setAttribute("iParam",new D(o,3));const b=new m({vertexShader:F,fragmentShader:Y,glslVersion:f,side:T,uniforms:{uSide:{value:r},uTexture:{value:null}}});this.mesh=new u(s,b),this.scene.add(this.mesh)}update(e){this.mesh.material.uniforms.uTexture.value=e}}var O=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,W=`uniform float uTime;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    float time = uTime * .007;
    vec2 xy = vUv * 2. - .1;
    vec3 col = vec3(0);
    float scale = 3.;

    float p = 
        sin(distance(vec2(xy.x + time, xy.y), vec2(.4, .8)) * scale)
        + sin(distance(vec2(xy.x-time*.4, xy.y+time*.7), vec2(0)) * scale)
        + sin(distance(vec2(xy.x + .2,xy.y), vec2(-.6 * sin(time* .4), .2 )) * scale)
         + sin(distance(vec2(xy.x * 1.2,xy.y-.2), vec2(.2 * sin(time), .5 * cos(time))) * scale);
    col += vec3(.5*.5*sin(p), cos(p), cos(p)-sin(p)) + .1;

    oColor = vec4(col, length(col));
}`;class k{constructor(){t(this,"renderer");t(this,"camera");t(this,"target");t(this,"mesh");const e=new a;this.camera=e.oCamera,this.renderer=e.renderer,this.target=new q(e.size.width,e.size.height);const n=new p(2,2),s=new m({vertexShader:O,fragmentShader:W,glslVersion:f,uniforms:{uTime:{value:0}}});this.mesh=new u(n,s)}get texture(){return this.target.texture}render(){this.mesh.material.uniforms.uTime.value+=1,this.renderer.setRenderTarget(this.target),this.renderer.render(this.mesh,this.camera),this.renderer.setRenderTarget(null)}}class B{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"sample");t(this,"boxes");t(this,"plasma");t(this,"fxaa");const e=new a;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new q(e.size.width,e.size.height),this.setUp()}setUp(){this.boxes=new Z,this.plasma=new k,this.fxaa=new U}update(){this.plasma.render(),this.boxes.update(this.plasma.texture),this.renderer.setRenderTarget(this.target),this.renderer.render(this.scene,this.camera),this.fxaa.render(null,this.target.texture)}resize(){}}let v;class a{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(v)return v;!e||(v=this,this.init(e))}init(e){this.debug=new G,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new g,this.scene.background=new w("#4bcebe"),this.camera=new S(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,10,23),this.oCamera=new M(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new R({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=Q,this.world=new B,new X(this.camera,e),this.render(),this.debug.status==="ON"&&this.debug.ui.addFolder("main").addColor({back:0},"back").name("background").onChange(s=>{console.log(s),this.scene.background=new w(s)})}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const I=document.querySelector(".webgl"),L=new a(I);window.addEventListener("resize",()=>{L.resize()});
