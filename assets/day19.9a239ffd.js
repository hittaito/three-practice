var E=Object.defineProperty;var L=(r,e,n)=>e in r?E(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(L(r,typeof e!="symbol"?e+"":e,n),n);import{S as R,d as C,e as p,M as y,t as s,B as _,I as U,q as A,G as I,O as S,a6 as q,a7 as W,a8 as T,K as N,D as O,c as F,i as K,j as V,a9 as X,N as Y,P as H,W as j,s as $}from"./three.module.9352233f.js";import{O as Z}from"./OrbitControls.e80330a0.js";import"./stats.min.46d05fb3.js";import{F as J}from"./FXAAShader.0b4b74a1.js";class ee{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class ne{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new z;this.scene=new R,this.camera=e.oCamera,this.renderer=e.renderer;const n=new C(2,2),i=new p({...J});this.mesh=new y(n,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var B=`#define PI acos(-1.)
#define TAU 2.*PI

uniform float uTime;
uniform mat4 uShadowPMat;
uniform mat4 uShadowVMat;

in vec2 iXY;
in float iRnd;

out vec2 vUv;
out float vRnd;
out vec4 vShadowCoord;
out vec3 vPosition;

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

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c,-s,s,c);
}
float map(float y1, float y2, float x) {
  return (y2-y1) * x + y1;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float time = uTime * .01;
  float angle = iRnd * TAU;
  float n = cnoise(vec3(iXY * .02, time)) * .5+.5;
  float n2 = iRnd;
  float scale = map(1.1, 3., n);
  
  pos.yz *= rot(map(- PI * .1, PI * .1, n2)+time);
  pos.zx *= rot(map(- PI * .1, PI * .1, n2)+time);
  pos.xy *= rot(map(- PI , PI , n));

  pos.xyz *= (scale + n2 );
  pos.z *= map(1., 2., n) * (1.+length(iXY) * .01 + iXY.x * .0003);
  pos.xy += iXY * 2.5;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  vRnd = iRnd;
  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  vShadowCoord = uShadowPMat * uShadowVMat * modelMatrix * vec4(pos, 1.);
}`,te=`#define PI acos(-1.)
#define TAU 2.*PI

uniform sampler2D uDepthMap;
uniform vec3 uLightPos;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

in vec2 vUv;
in float vRnd;
in vec3 vPosition;
in vec4 vShadowCoord;

out vec4 oColor;

#include <packing>

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hueShiftYIQ(vec3 color, float hueShift){
    const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
    const vec3  kRGBToI     = vec3 (0.596, -0.275, -0.321);
    const vec3  kRGBToQ     = vec3 (0.212, -0.523, 0.311);

    const vec3  kYIQToR   = vec3 (1.0, 0.956, 0.621);
    const vec3  kYIQToG   = vec3 (1.0, -0.272, -0.647);
    const vec3  kYIQToB   = vec3 (1.0, -1.107, 1.704);

    float   YPrime  = dot (color, kRGBToYPrime);
    float   I      = dot (color, kRGBToI);
    float   Q      = dot (color, kRGBToQ);

    
    float   hue     = atan (Q, I);
    float   chroma  = sqrt (I * I + Q * Q);

    hue += hueShift;

    
    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    
    vec3    yIQ   = vec3 (YPrime, I, Q);
    color.r = dot (yIQ, kYIQToR);
    color.g = dot (yIQ, kYIQToG);
    color.b = dot (yIQ, kYIQToB);

    return color;
}

void main(void) {
  vec3 shadowCoord = (vShadowCoord.xyz/vShadowCoord.w)*.5+.5;
  float depth = unpackRGBAToDepth(texture(uDepthMap, shadowCoord.xy));

  
  vec3 nx = dFdx(vPosition);
  vec3 ny = dFdy(vPosition);
  vec3 normal = normalize(cross(normalize(nx), normalize(ny)));
  float cosTheta = dot(normalize(uLightPos), normal);
  float bias = .005 * tan(acos(cosTheta));
  bias = clamp(bias, .0, .02);

  float shadowFactor = step(depth - bias, shadowCoord.z );

  bvec4 inFrustum4 = bvec4(shadowCoord.x>0., shadowCoord.x<1., shadowCoord.y>0.,shadowCoord.y<1.);
  bool frustum = all(inFrustum4);
  bvec2 inFrustum2 = bvec2(frustum, shadowCoord.z<1.);
  frustum = all(inFrustum2);
  if (frustum == false) {
    shadowFactor = 1.;
  }
  float diffLight = max(0., cosTheta);
  float shading = shadowFactor * diffLight;

  vec3 color = (vRnd<.01) ? uColor2 : uColor1;

  color = hueShiftYIQ(color, -length(vPosition.xy) * .0005 * TAU);
  color = mix(color - 0.1, color + 0.1, shading);

  oColor = vec4(color, 1.);
  
}`,ie=`#include <packing>

out vec4 outColor;

void main(){
    
    outColor = packDepthToRGBA(gl_FragCoord.z);
}`;const M={PRIMARY1:new s("#2db987"),PRIMARY2:new s("#2CB1BF"),PRIMARY3:new s("#00935F"),PRIMARY4:new s("#00935F"),PRIMARY5:new s("#00935F"),SECONDARY1:new s("#FFB03E"),SECONDARY2:new s("#FF9701"),SECONDARY3:new s("#DB8200"),SECONDARY4:new s("#B26900"),SECONDARY5:new s("#6F8ABF"),ACCENT1:new s("#F2C230"),ACCENT2:new s("#EC013C"),ACCENT3:new s("#C80032"),ACCENT4:new s("#A20029"),ACCENT5:new s("#7B001F")},h=60;class oe{constructor(){t(this,"scene");t(this,"baseMat");t(this,"shadowMat");t(this,"mesh");const e=new z;this.scene=e.scene;const n=new _(1,1,10),i=new U;i.instanceCount=h*h,i.index=n.index,i.attributes=n.attributes;const v=new Float32Array(h*h*2),c=new Float32Array(h*h);let a=0;for(let l=0;l<h;l++)for(let m=0;m<h;m++)v[a*2+0]=l-h/2,v[a*2+1]=m-h/2,c[a]=Math.random(),a++;i.setAttribute("iXY",new A(v,2)),i.setAttribute("iRnd",new A(c,1));const u=new p({vertexShader:B,fragmentShader:te,glslVersion:I,uniforms:{uTime:{value:0},uLightPos:{value:null},uDepthMap:{value:null},uShadowPMat:{value:null},uShadowVMat:{value:null},uColor1:{value:M.PRIMARY2},uColor2:{value:M.ACCENT1}}});this.baseMat=u,this.shadowMat=new p({vertexShader:B,fragmentShader:ie,glslVersion:I,uniforms:{uTime:{value:0}}}),this.mesh=new y(i,u),this.scene.add(this.mesh)}update(e){this.shadowMat.uniforms.uTime.value+=1,this.baseMat.uniforms.uTime.value+=1,this.baseMat.uniforms.uLightPos.value=e.position,this.baseMat.uniforms.uShadowPMat.value=e.shadow.camera.projectionMatrix,this.baseMat.uniforms.uShadowVMat.value=e.shadow.camera.matrixWorldInverse}updateShadowMap(e){this.baseMat.uniforms.uDepthMap.value=e}setMat(e){e==="base"?this.mesh.material=this.baseMat:this.mesh.material=this.shadowMat}}const se={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		#include <packing>

		void main() {

			float depth = 1.0 - unpackRGBAToDepth( texture2D( tDiffuse, vUv ) );
			gl_FragColor = vec4( vec3( depth ), opacity );

		}`};class ae{constructor(e){const n=this,i=e.name!==void 0&&e.name!=="";let v;const c={x:10,y:10,width:256,height:256},a=new S(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,10);a.position.set(0,0,2);const u=new R,l=se,m=q.clone(l.uniforms),D=new p({uniforms:m,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),k=new C(c.width,c.height),w=new y(k,D);u.add(w);let d,P;if(i){d=document.createElement("canvas");const o=d.getContext("2d");o.font="Bold 20px Arial";const f=o.measureText(e.name).width;d.width=f,d.height=25,o.font="Bold 20px Arial",o.fillStyle="rgba( 255, 0, 0, 1 )",o.fillText(e.name,0,20);const g=new W(d);g.magFilter=T,g.minFilter=T,g.needsUpdate=!0;const x=new N({map:g,side:O});x.transparent=!0;const Q=new C(d.width,d.height);P=new y(Q,x),u.add(P)}function G(){n.position.set(n.position.x,n.position.y)}this.enabled=!0,this.size={width:c.width,height:c.height,set:function(o,f){this.width=o,this.height=f,w.scale.set(this.width/c.width,this.height/c.height,1),G()}},this.position={x:c.x,y:c.y,set:function(o,f){this.x=o,this.y=f;const g=n.size.width,x=n.size.height;w.position.set(-window.innerWidth/2+g/2+this.x,window.innerHeight/2-x/2-this.y,0),i&&P.position.set(w.position.x,w.position.y-n.size.height/2+d.height/2,0)}},this.render=function(o){this.enabled&&(m.tDiffuse.value=e.shadow.map.texture,v=o.autoClear,o.autoClear=!1,o.clearDepth(),o.render(u,a),o.autoClear=v)},this.updateForWindowResize=function(){this.enabled&&(a.left=window.innerWidth/-2,a.right=window.innerWidth/2,a.top=window.innerHeight/2,a.bottom=window.innerHeight/-2,a.updateProjectionMatrix(),this.update())},this.update=function(){this.position.set(this.position.x,this.position.y),this.size.set(this.size.width,this.size.height)},this.update()}}class re{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"viewer");t(this,"light");t(this,"sample");t(this,"boxes");t(this,"fxaa");const e=new z;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new F(e.size.width,e.size.height),this.setUp()}setUp(){const e=new K(16777215,.2);this.scene.add(e);const n=new V(16777215,1);n.position.set(20,25,70),this.scene.add(n);const i=140;n.shadow.camera=new S(-i/2,i/2,i/2,-i/2,1,120),n.shadow.camera.position.copy(n.position),n.shadow.camera.lookAt(this.scene.position),this.scene.add(n.shadow.camera),n.shadow.mapSize.set(2048,2048),n.shadow.map=new F(2048,2048,{format:X,minFilter:Y,magFilter:Y}),this.light=n,this.viewer=new ae(n),this.viewer.size.set(300,300),this.boxes=new oe,this.fxaa=new ne}update(){this.boxes.update(this.light),this.boxes.setMat("shadow"),this.renderer.setRenderTarget(this.light.shadow.map),this.renderer.render(this.scene,this.light.shadow.camera),this.boxes.setMat("base"),this.boxes.updateShadowMap(this.light.shadow.map.texture),this.renderer.setRenderTarget(this.target),this.renderer.render(this.scene,this.camera),this.fxaa.render(null,this.target.texture)}resize(){}}let b;class z{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(b)return b;!e||(b=this,this.init(e))}init(e){this.debug=new ee,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new R,this.scene.background=M.SECONDARY5,this.camera=new H(45,this.size.width/this.size.height,.1,1e3),this.camera.position.set(0,0,100),this.oCamera=new S(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new j({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=$,this.world=new re,new Z(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const ce=document.querySelector(".webgl"),he=new z(ce);window.addEventListener("resize",()=>{he.resize()});
