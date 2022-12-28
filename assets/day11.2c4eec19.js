var F=Object.defineProperty;var V=(t,e,i)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var n=(t,e,i)=>(V(t,typeof e!="symbol"?e+"":e,i),i);import{p as C,I as S,q as A,e as d,G as g,r as M,t as p,M as v,u as x,F as y,d as z,V as L,S as b,c as R,j as _,P as T,O as B,W as G,s as D}from"./three.module.d3d6ea96.js";import{O as Q}from"./OrbitControls.3e08d4ed.js";import"./stats.min.46d05fb3.js";import{F as U}from"./FXAAShader.b0cf4fbe.js";class W{constructor(){n(this,"ui");n(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var I=`uniform sampler2D uPosition;
uniform sampler2D uVelocity;

in float id;
in float historyId;

out vec3 vNormal;

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
  ivec2 uv = ivec2(id, 0);
  vec3 pos = texelFetch(uPosition, uv, 0).xyz;

  vec3 dir = normalize(texelFetch(uVelocity, uv, 0).xyz);
  vec3 top = vec3(0,1,0);
  vec3 c = cross( dir,top);
  float a =-acos(dot(dir,top));
  vec4 q = rotQ(c, a);
  vec3 newPos = appQ(position, q);
  vNormal = appQ(normal, q);

  gl_Position = projectionMatrix*modelViewMatrix*vec4(pos+newPos, 1.);
}`,O=`uniform vec3 diffuse;
uniform vec3 emissive;

out vec4 outColor;

#include <common>

#include <bsdfs>
#include <lights_pars_begin>
#include <lights_lambert_pars_fragment>

void main() {
  
  
	
  
  
  
	
	
  
  

  
	
	
	
	

  
	
	
	
	
	
	
	
	
	
	
	

  
  outColor = vec4(1, 0,0,1);
}`;class j{constructor(e,i){n(this,"scene");n(this,"mesh");const a=new u;this.scene=a.scene;const r=new C(.1,.4,16),s=new S;s.instanceCount=e,s.index=r.index,s.attributes=r.attributes;const l=new Float32Array(e);let c=0;for(let m=0;m<e;m++)l[c]=m,c++;s.setAttribute("id",new A(l,1));const o=new d({vertexShader:I,fragmentShader:O,glslVersion:g,uniforms:{...M.lights,uPosition:{value:null},uVelocity:{value:null},diffuse:{value:new p(16777215)},emissive:{value:new p(0)}},lights:!0});this.mesh=new v(s,o),this.scene.add(this.mesh)}update(e){this.mesh.material.uniforms.uPosition.value=e.texture[0],this.mesh.material.uniforms.uVelocity.value=e.texture[1]}}var E=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,$=`in vec2 vUv;

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
}`,H=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,N=`uniform float uTime;
uniform float uLimit;
uniform float uSeparate;
uniform float uArea;
uniform float uSepareteForce;
uniform float uCohesionForce;
uniform float uAlignForce;
uniform vec2 uPointer;
uniform float uPointerLimit;
uniform float uPointerForce;

uniform sampler2D uPosition;
uniform sampler2D uVelocity;

in vec2 vUv;

layout(location = 0) out vec4 oPosition;
layout(location = 1) out vec4 oVelocity;

#define PI acos(-1.)

void main(void) {
  float radius = uSeparate + uArea;

  ivec2 size = textureSize(uPosition, 0);
  ivec2 uv = ivec2(gl_FragCoord.xy);
  vec3 pos, vel;
  if (uv.y == 0) {
    pos = texelFetch(uPosition, uv, 0).xyz;
    vel = texelFetch(uVelocity, uv, 0).xyz;

    vel = mix(vel, -normalize(pos), smoothstep(6., 10., length(pos)));

    
    vec3 dir = vec3(uPointer, 0.) * 10. - vec3(pos.xy, 0.);
    float dist = length(dir);
    if (dist < uPointerLimit) {
      vel -= normalize(dir) * uPointerForce;
    }

    vec3 cohesion, separation, align;
    float nCohesion, nSeparation, nAlign;
    for (int x = 0; x < size.x;x++) {
      int y = 0;
      vec3 otherPos = texelFetch(uPosition, ivec2(x,y), 0).xyz;
      vec3 dir = otherPos - pos;
      float dist = length(dir);

      if (dist < 0.0001 || dist > radius) continue;

      cohesion += otherPos;
      nCohesion++;

      if (dist < uSeparate) {
        separation -= dir;
      }

      vec3 otherVel = texelFetch(uVelocity, ivec2(x,y), 0).xyz;
      otherVel = mix(otherVel, -normalize(otherPos), smoothstep(10., 15., length(otherPos)));
      align += otherVel;
      nAlign++;
    }
    vec3 cohesDir = vec3(0);
    if (nCohesion > 0.) {
      cohesion/= nCohesion;
      cohesDir = cohesion - pos;
    }

    if (nAlign > 0.) {
      align /= nAlign;
    }

    vel += cohesDir * uCohesionForce + separation  * uSepareteForce + align * uAlignForce;

    if ( length( vel ) > uLimit ) {
        vel = normalize( vel ) * uLimit ;
    }
    pos += vel * .1;
  } else {
    pos = texelFetch(uPosition, uv - ivec2(0,1), 0).xyz;
    vel = texelFetch(uVelocity, uv - ivec2(0,1), 0).xyz;
  }

  oPosition = vec4(pos, 1.);
  oVelocity = vec4(vel,1.);
}`;class X{constructor(e,i){n(this,"targets");n(this,"renderer");n(this,"camera");n(this,"mesh");n(this,"flag",0);const a=new u,r=a.debug;this.camera=a.oCamera,this.renderer=a.renderer,this.targets=[new x(e,i,2,{type:y}),new x(e,i,2,{type:y})];const s=new z(2,2),l=new d({vertexShader:E,fragmentShader:$,glslVersion:g}),c=new v(s,l);this.renderer.setRenderTarget(this.writeBuffer),this.renderer.render(c,this.camera),this.flag=1-this.flag;const o=new d({vertexShader:H,fragmentShader:N,glslVersion:g,uniforms:{uTime:{value:0},uLimit:{value:.6},uPosition:{value:null},uVelocity:{value:null},uSeparate:{value:.6},uArea:{value:.05},uSepareteForce:{value:.2},uCohesionForce:{value:.2},uAlignForce:{value:2},uPointer:{value:new L(1,1)},uPointerLimit:{value:1.3},uPointerForce:{value:2},uCamera:{value:this.camera.modelViewMatrix}}});this.mesh=new v(s,o),r.ui&&(r.ui.add(o.uniforms.uLimit,"value",0,3,.01).name("limit"),r.ui.add(o.uniforms.uSeparate,"value",0,2,.001).name("separateArea"),r.ui.add(o.uniforms.uArea,"value",0,2,.001).name("area"),r.ui.add(o.uniforms.uSepareteForce,"value",0,2,.001).name("separate"),r.ui.add(o.uniforms.uCohesionForce,"value",0,3,.001).name("chohesion"),r.ui.add(o.uniforms.uAlignForce,"value",0,3,.001).name("align"),r.ui.add(o.uniforms.uPointerLimit,"value",0,3,.001).name("pointer area"),r.ui.add(o.uniforms.uPointerForce,"value",0,3,.001).name("pointer force"))}get readBuffer(){return this.targets[this.flag]}get writeBuffer(){return this.targets[1-this.flag]}render(){this.renderer.setRenderTarget(this.writeBuffer),this.mesh.material.uniforms.uPosition.value=this.readBuffer.texture[0],this.mesh.material.uniforms.uVelocity.value=this.readBuffer.texture[1],this.renderer.render(this.mesh,this.camera),this.flag=1-this.flag,this.renderer.setRenderTarget(null)}onMouse(e,i){this.mesh.material.uniforms.uPointer.value.x=e,this.mesh.material.uniforms.uPointer.value.y=i}}class Y{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");const e=new u;this.scene=new b,this.camera=e.oCamera,this.renderer=e.renderer;const i=new z(2,2),a=new d({...U});this.mesh=new v(i,a),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,i){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=i,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}const q=100,P=10;class k{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"target");n(this,"sample");n(this,"instance");n(this,"boids");n(this,"fxaa");const e=new u;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new R(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio)),this.setUp()}setUp(){this.instance=new j(q,P);const e=new _(65280,1);e.position.y=3,this.scene.add(e),this.boids=new X(q,P),this.fxaa=new Y}update(){this.boids.render(),this.instance.update(this.boids.readBuffer),this.renderer.render(this.scene,this.camera)}resize(){}onMouse(e,i){this.boids.onMouse(e,i)}}let f;class u{constructor(e){n(this,"scene");n(this,"camera");n(this,"oCamera");n(this,"renderer");n(this,"world");n(this,"size");n(this,"debug");if(f)return f;!e||(f=this,this.init(e))}init(e){this.debug=new W,this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new b,this.camera=new T(75,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,10),this.oCamera=new B(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new G({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=D,this.world=new k;const i=new Q(this.camera,e);i.enableZoom=!1,this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}onMouse(e,i){this.world.onMouse(e,i)}}const h=document.querySelector(".webgl"),w=new u(h);window.addEventListener("resize",()=>{w.resize()});h.addEventListener("mousemove",t=>{const e=h.width,i=h.height;w&&w.onMouse(t.clientX/e*2-1,(1-t.clientY/i)*2-1)});
