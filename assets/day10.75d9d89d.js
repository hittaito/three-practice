var H=Object.defineProperty;var T=(r,e,n)=>e in r?H(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(T(r,typeof e!="symbol"?e+"":e,n),n);import{c as m,F as x,d as v,e as h,G as u,M as o,f as F,B as S,D as P,S as d,N as M,V as D,g as U,h as j,U as L,C as V,s as b,A as _,O as f,i as N,j as R,k as I,P as W,W as Z}from"./three.module.d3d6ea96.js";import{O as C}from"./OrbitControls.3e08d4ed.js";import"./stats.min.46d05fb3.js";import{F as E}from"./FXAAShader.b0cf4fbe.js";class G{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var A=`uniform sampler2D uHeightMap;

in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;
in vec3 vNew;
in vec3 vOld;
in float vWaterDepth;
in float vDepth;

out vec4 oColor;

void main(void) {
  float intensity = 0.;

  
    float old = length(dFdx(vOld)) * length(dFdy(vOld));
    float new = length(dFdx(vNew)) * length(dFdy(vNew));

    float ratio;
    if (new == 0.) {
      ratio = 2.0 + 20.;
    } else {
      ratio = old/new;
    }
    intensity = ratio;
  

    oColor = vec4(vec3(intensity * .01), 1.);
    
}`,O=`#include <packing>

uniform vec3 uLight;
uniform sampler2D uEnvMap; 
uniform sampler2D uHeightMap;
uniform float uTime;
uniform float cameraNear;
uniform float cameraFar;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out vec3 vOld;
out vec3 vNew;
out float vWaterDepth;
out float vDepth;

float readZ(vec2 uv) {
  float fragCoordZ = texture(uEnvMap, uv).x;
  float viewZ = orthographicDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  vec3 pos = (modelMatrix * vec4(position, 1.)).xyz; 
 
  ivec2 st = ivec2(uv * vec2(textureSize(uHeightMap, 0))) ;
  float h = texelFetch(uHeightMap, st, 0).r;
  vec4 aa = texelFetch(uHeightMap, st, 0);

  float diff = .08;
  vec3 dx = vec3(diff,texelFetch(uHeightMap, st+ivec2(-1,0), 0).r-texelFetch(uHeightMap, st+ivec2(1,0), 0).r, 0);
  vec3 dz = vec3(0.  ,texelFetch(uHeightMap, st+ivec2(0,-1), 0).r-texelFetch(uHeightMap, st+ivec2(0,1), 0).r, diff);
  vec3 n = normalize(cross(-dx,dz));
  

  pos.y += h;

  vOld = (projectionMatrix * viewMatrix * vec4(pos, 1.)).xyz;

  
  vec3 refractedDir = refract(normalize(vec3(0., - .8, 0.1)), n, 0.79);
  vec4 projectedRefractedDir = projectionMatrix * viewMatrix * vec4(refractedDir, 1.);

  
  vec4 projectedWaterPosition = projectionMatrix * viewMatrix * vec4(pos, 1.0); 
  vec3 current = projectedWaterPosition.xyz;
  vec2 cood = current.xy * .5 +.5;
  float depth = current.z + 2.5; 

  float readDepth = readZ(cood); 
  float x = 0.;
  for (int i=0;i<50;i++) {
    cood += projectedRefractedDir.xz * 0.005;
    depth -= projectedRefractedDir.y * .1;
    if (depth <= readDepth) {
      break;
    }
    readDepth = readZ(cood);
    x = float(i);
  }

  vNew =  vec3(cood.x, readDepth, cood.y);
  vec4 projectedEndPositon = projectionMatrix * viewMatrix * vec4(vNew, 1.);

  vWaterDepth = projectedWaterPosition.z/projectedWaterPosition.w * .5 + .5;
  vDepth = projectedEndPositon.z/projectedRefractedDir.w * .5 + .5;

  vUv = uv;
  vNormal = n;
  vPosition = projectedRefractedDir.xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos,1.);
}`;class k{constructor(e,n){t(this,"camera");t(this,"renderer");t(this,"target");t(this,"mesh");const i=new a;this.renderer=i.renderer,this.camera=i.oCamera;const s=1024,c=1024;this.target=new m(s*2,c*2,{type:x});const l=new v(2,2,s,c),p=new h({vertexShader:O,fragmentShader:A,glslVersion:u,uniforms:{uEnvMap:{value:null},uHeightMap:{value:null},uTime:{value:0},cameraNear:{value:e},cameraFar:{value:n}},transparent:!0});this.mesh=new o(l,p),this.mesh.rotateX(-Math.PI*.5)}update(e,n){this.mesh.material.uniforms.uEnvMap.value=e,this.mesh.material.uniforms.uHeightMap.value=n,this.renderer.setRenderTarget(this.target)}}class q{constructor(){t(this,"topView");t(this,"finalView");t(this,"geom");t(this,"mesh");const e=new a;this.topView=e.scene.topView,this.finalView=e.scene.final,this.geom=new v(2,2);const n=new F({color:16711680});this.mesh=new o(this.geom,n),this.mesh.rotateX(-Math.PI*.5),this.mesh.position.y=-1,this.mesh.receiveShadow=!0,this.mesh.castShadow=!0,console.log(this.topView),this.topView.add(this.mesh),this.finalView.add(this.mesh)}}var X=`uniform float uTime;

in vec2 vUv;

out vec4 oColor;

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

void main(void) {
    vec2 uv = (vUv - .5) * 5.;
    float n = snoise(vec3(uv, uTime * 0.01));
    oColor = vec4(vec3(n), 1.);
}`,$=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class B{constructor(){t(this,"scene");t(this,"geom");t(this,"mat");t(this,"mesh");const e=new a;this.scene=e.scene.topView,this.setUp()}setUp(){this.geom=new S(1,1),this.mat=new h({fragmentShader:X,vertexShader:$,glslVersion:u,uniforms:{uTime:{value:0}}}),this.mesh=new o(this.geom,this.mat),this.mesh.castShadow=!0,this.scene.add(this.mesh)}update(){this.mesh.rotation.y+=.01,this.mesh.material.uniforms.uTime.value+=1}}var J=`uniform samplerCube uCube;

in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;

out vec4 oColor;

void main(void) {
    vec3 n = vNormal;
    vec3 pos = vPosition;

    vec3 eye = normalize(pos - cameraPosition);
    vec3 refracted = normalize(refract(eye, n, .7));

    vec4 envColor = texture(uCube, refracted);

    oColor = vec4(envColor.xyz, 1.);
}`,K=`uniform sampler2D uHeightMap;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;

void main() {
  vec3 pos = (modelMatrix * vec4(position,1.)).xyz;

  ivec2 st = ivec2(uv * vec2(textureSize(uHeightMap, 0))) ;
  float h = texelFetch(uHeightMap, st, 0).w;

  vec3 n = normalize(vec3(
    texelFetch(uHeightMap, st+ivec2(-1,0), 0).w - texelFetch(uHeightMap, st+ivec2(1,0), 0).w,
    0.,
    texelFetch(uHeightMap, st+ivec2(0,-1), 0).w - texelFetch(uHeightMap, st+ivec2(0,1), 0).w
  ));

  pos.y += h;

  vUv = uv;
  vNormal = n;
  vPosition = pos;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}`;class Q{constructor(){t(this,"scene");t(this,"mesh");const e=new a;this.scene=e.scene.topView;const n=new v(2,2,512,512),i=new h({vertexShader:K,fragmentShader:J,glslVersion:u,side:P,uniforms:{uHeightMap:{value:null},uCube:{value:null}}});this.mesh=new o(n,i),this.mesh.rotateX(-Math.PI*.5),this.scene.add(this.mesh)}setCube(e){this.mesh.material.uniforms.uCube.value=e}update(e){this.mesh.material.uniforms.uHeightMap.value=e}}class Y{constructor(e,n){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const i=new a;this.scene=new d,this.camera=i.oCamera,this.renderer=i.renderer;const s=new v(2,2),c=new h({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
			#include <packing>

			varying vec2 vUv;
			uniform sampler2D tDiffuse;
			uniform sampler2D tDepth;
			uniform float cameraNear;
			uniform float cameraFar;


			float readDepth( sampler2D depthSampler, vec2 coord ) {
				float fragCoordZ = texture2D( depthSampler, coord ).x;
				float viewZ = orthographicDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			}

			void main() {
				//vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
				float depth = readDepth( tDepth, vUv );

				gl_FragColor.rgb = 1. - vec3( depth ) ;
				gl_FragColor.a = 1.0;
			}`,uniforms:{tDiffuse:{value:null},tDepth:{value:null},cameraNear:{value:e},cameraFar:{value:n}}});this.mesh=new o(s,c),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDiffuse.value=e.texture,this.mesh.material.uniforms.tDepth.value=e.depthTexture,this.renderer.render(this.scene,this.camera)}}class ee{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new d,this.camera=e.oCamera,this.renderer=e.renderer;const n=new v(2,2),i=new h({...E});this.mesh=new o(n,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}class te{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new d,this.camera=e.oCamera,this.renderer=e.renderer;const n=new v(2,2),i=new h({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, vUv);
            }`,uniforms:{tDiffuse:{value:null}}});this.mesh=new o(n,i),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDiffuse.value=e,this.renderer.render(this.scene,this.camera)}}var ne=`uniform float uTime;
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

  float G = .5;
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

void main(void) {
    
    
    
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
}`,z=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`,re=`uniform sampler2D uHeight;
uniform vec2 uMouse;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec4 height = texture(uHeight, vUv);

  float strength = smoothstep(.95, 1.,1. - length(uMouse - vUv)*3.);

  height.r += strength * 1.;
  outColor = vec4(height);
}`;class ie{constructor(){t(this,"camera");t(this,"renderer");t(this,"targets");t(this,"readIndex",0);t(this,"first");t(this,"second");const e=new a;this.camera=e.oCamera,this.renderer=e.renderer;const n=1024,i=n,s=n;this.targets=[new m(i,s,{type:x}),new m(i,s,{type:x})],this.targets.forEach(y=>{y.texture.minFilter=M,y.texture.magFilter=M});const c=new v(2,2),l=new h({vertexShader:z,fragmentShader:re,glslVersion:u,uniforms:{uTime:{value:0},uHeight:{value:null},uMouse:{value:new D(e.mouse.x,e.mouse.y)}}});this.first=new o(c,l);const p=new h({vertexShader:z,fragmentShader:ne,glslVersion:u,uniforms:{uTime:{value:0},uHeight:{value:null}}});this.second=new o(c,p)}get target(){return this.targets[this.readIndex]}get invTarget(){return this.targets[1-this.readIndex]}render(){this.renderer.setRenderTarget(this.invTarget),this.first.material.uniforms.uHeight.value=this.target.texture,this.first.material.uniforms.uTime.value+=1,this.renderer.render(this.first,this.camera),this.readIndex=1-this.readIndex,this.renderer.setRenderTarget(this.invTarget),this.second.material.uniforms.uHeight.value=this.target.texture,this.renderer.render(this.second,this.camera),this.readIndex=1-this.readIndex}updateMouse(e,n){this.first.material.uniforms.uMouse.value=new D(e,n)}}class ae{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"topCamera");t(this,"sunLight");t(this,"topLight");t(this,"heightMap");t(this,"sample");t(this,"floor");t(this,"water");t(this,"caustics");t(this,"fxaa");t(this,"viewer");t(this,"depthViewer");const e=new a;this.scene=e.scene.final,this.camera=e.camera,this.renderer=e.renderer,this.target=new m(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio));const n=1024,i=1024;this.target.depthTexture=new U(n,i),this.target.depthTexture.format=j,this.target.depthTexture.type=L,this.setUp()}setC(e){new C(this.topCamera,e)}setUp(){const n=new V().load(["/envmap/px.jpg","/envmap/nx.jpg","/envmap/py.jpg","/envmap/ny.jpg","/envmap/pz.jpg","/envmap/nz.jpg"]);n.encoding=b,this.scene.background=n,this.scene.environment=n,this.scene.add(new _(6)),this.topCamera=new f(-1,1,1,-1,.1,10),this.topCamera.position.set(0,3,0),this.topCamera.lookAt(0,0,0);const i=new N(16777215,.1);this.scene.add(i),this.sunLight=new R(16724787,.4),this.sunLight.position.set(2,2,0),this.sunLight.castShadow=!0,this.sunLight.shadow.camera=new f(-2,2,2,-2,.1,10),this.scene.add(this.sunLight);const s=new I(this.sunLight);this.scene.add(s),this.sample=new B,this.floor=new q,this.water=new Q,this.water.setCube(n),this.caustics=new k(this.sunLight.shadow.camera.near,this.sunLight.shadow.camera.far),this.heightMap=new ie,this.fxaa=new ee,this.viewer=new te,this.depthViewer=new Y(this.sunLight.shadow.camera.near,this.sunLight.shadow.camera.far)}update(){this.heightMap.render(),this.renderer.setRenderTarget(this.target),this.sample.update(),this.renderer.render(this.scene,this.topCamera),this.caustics.update(this.target.depthTexture,this.heightMap.target.texture),this.renderer.render(this.caustics.mesh,this.topCamera),this.renderer.setRenderTarget(null),this.fxaa.render(null,this.caustics.target.texture)}resize(){}updateMouse(e,n){this.heightMap.updateMouse(e,n)}}let g;class a{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"currentMouse",{x:.5,y:.5});t(this,"mouse",{x:.5,y:.5});t(this,"debug");if(g)return g;!e||(g=this,this.init(e))}init(e){this.debug=new G,this.size={width:window.innerWidth,height:window.innerHeight},this.scene={topView:new d,final:new d},this.camera=new W(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,4),this.camera.lookAt(0,0,0),this.oCamera=new f(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new Z({canvas:e}),this.renderer.shadowMap.enabled=!0,this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=b,this.world=new ae,new C(this.camera,e),this.render()}render(){this.debug.begin(),this.updateMouse(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}updateMouse(){const e={x:this.currentMouse.x-this.mouse.x,y:this.currentMouse.y-this.mouse.y};this.mouse={x:this.mouse.x+e.x*.1,y:this.mouse.y+e.y*.1},this.world.updateMouse(this.mouse.x,this.mouse.y)}}const se=document.querySelector(".webgl"),w=new a(se);window.addEventListener("resize",()=>{w.resize()});window.addEventListener("mousemove",r=>{w&&(w.currentMouse={x:r.x/window.innerWidth,y:1-r.y/window.innerHeight})});
