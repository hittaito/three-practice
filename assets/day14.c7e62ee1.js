var k=Object.defineProperty;var I=(i,e,n)=>e in i?k(i,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[e]=n;var t=(i,e,n)=>(I(i,typeof e!="symbol"?e+"":e,n),n);import{d as f,K as R,M as y,I as U,q as _,e as q,G as C,D as T,Y as D,v as E,a4 as B,y as G,a1 as P,S as g,c as w,F as j,C as L,s as S,P as V,O as W,W as H}from"./three.module.da3d5bd6.js";import{D as F,t as O,d as Q,B as $,W as N}from"./three-to-cannon.modern.c4d8f170.js";import{O as Z}from"./OrbitControls.33791f63.js";import"./stats.min.46d05fb3.js";import{F as K}from"./FXAAShader.6da588bf.js";class X{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class Y{constructor(){t(this,"scene");t(this,"mesh");const e=new m;this.scene=e.scene3;const n=new f(2,2),s=new R({map:null});this.mesh=new y(n,s),this.mesh.position.z=-1,this.scene.add(this.mesh)}setTexture(e){this.mesh.material.map=e}}var J=`uniform sampler2D uTexture;

in vec2 vUv;
in float vId;

out vec4 oColor;

void main(void) {
    vec3 col = texture(uTexture, 1. - vUv).xyz;
    oColor = vec4(col, 1.);
}`,ee=`in float id;

out vec2 vUv;
out float vId;

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

float r(float x) {
  return fract(sin(x * 34.49 + 932.23) * cos(x*238.18+48.29)) ;
}

vec3 random(float x) {
  return vec3(
    r(x) * 2. - 1.,
    r(x + 93.23) * 2. - 1.,
    r(x * 2.234 + 372.12) + 3.
  );
}

void main() {
  vec3 pos = position;
  pos += random(id) * vec3(20., 20., 10.);
  vec3 cPos = vec3(0);
  vec3 dir = normalize(cPos - pos);
  vec3 n = normalize(vec3(0., 0., 1.));
  float angle = acos(dot(n, dir));
  vec3 axis = cross(n, dir);
  vec4 q = rotQ(axis, angle);
  pos = appQ(pos, q);

  vUv = uv;
  vId = id;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;const b=800;class ne{constructor(){t(this,"scene");t(this,"mesh");const e=new m;this.scene=e.scene1;const n=new f(1,1),s=new U;s.instanceCount=b,s.index=n.index,s.attributes=n.attributes;const a=new Float32Array(b);for(let l=0;l<b;l++)a[l]=l;s.setAttribute("id",new _(a,1));const c=new q({fragmentShader:J,vertexShader:ee,glslVersion:C,side:T,uniforms:{uTexture:{value:null}}});this.mesh=new y(s,c),this.scene.add(this.mesh)}setTexture(e){this.mesh.material.uniforms.uTexture.value=e}}class te{constructor(){t(this,"scene");t(this,"mesh");const e=new m;this.scene=e.scene2;const n=new D(1,64,64),s=new E({color:16777215,reflectivity:0,metalness:.1,roughness:.1,opacity:.9,transparent:!0,ior:2.333,displacementScale:.1,vertexColors:!0});this.mesh=new y(n,s),this.scene.add(this.mesh)}setBackground(e){e.mapping=B,this.mesh.material.envMap=e}setHeightMap(e){this.mesh.material.displacementMap=e}}var se=`in vec3 origin;
in mat4 uMatrix;
out vec2 vUv;
out vec3 vPos;

void main() {
  vUv = uv;
  vPos = (modelViewMatrix * vec4(origin, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,oe=`uniform sampler2D uMap;
uniform float uOpacity;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec3 col = texture(uMap, vUv).xyz;
    oColor = vec4(col, uOpacity);
}`;const p=2,x=2,ie=100;class re{constructor(){t(this,"scene");t(this,"items",[]);const e=new m;this.scene=e.scene3;const n=[...new Array(ie)].map(()=>[Math.random()*p,Math.random()*x]),a=F.from(n).voronoi([0,0,p,x]);let c=0;const l=[];for(;;){const v=a.cellPolygon(c);if(v[0][0]==null)break;c++,l.push(v)}const r=new q({vertexShader:se,fragmentShader:oe,glslVersion:C,uniforms:{uMap:{value:null},uMatrix:{value:null},uOpacity:{value:1}},side:T,opacity:0,transparent:!0,wireframe:!1});l.forEach(v=>{v.shift();const u=this.makeGeom(v),d=new y(u.geom,r);d.position.x+=u.x-p/2,d.position.y+=u.y-x/2,this.scene.add(d);const o=O(d,{type:Q.HULL}).shape,h=new $({mass:1});h.addShape(o),h.angularVelocity.set(3,2,u.y),h.angularDamping=.8,e.physics.addBody(h),this.items.push({mesh:d,body:h,origin:{position:d.position.clone(),quaternion:d.quaternion.clone()}})}),this.apply()}setTexture(e){this.items.forEach(n=>{n.mesh.material.uniforms.uMap.value=e})}update(){this.items.forEach(e=>{e.mesh.position.set(e.body.position.x,e.body.position.y,e.body.position.z),e.mesh.quaternion.set(e.body.quaternion.x,e.body.quaternion.y,e.body.quaternion.z,e.body.quaternion.w)})}reset(){this.items.forEach(e=>{e.mesh.position.set(e.origin.position.x,e.origin.position.y,e.origin.position.z),e.mesh.quaternion.set(e.origin.quaternion.x,e.origin.quaternion.y,e.origin.quaternion.z,e.origin.quaternion.w),e.body.velocity.setZero(),e.body.position.set(e.mesh.position.x,e.mesh.position.y,e.mesh.position.z),e.body.quaternion.set(e.mesh.quaternion.x,e.mesh.quaternion.y,e.mesh.quaternion.z,e.mesh.quaternion.w)})}start(e,n){this.items.forEach(s=>{s.body.velocity.setZero();const a=s.mesh.position,c=100;s.body.angularDamping=1,s.body.angularVelocity.set((a.x-e)*c,(a.y-n)*c,0)})}apply(){this.items.forEach(e=>{e.body.position.set(e.mesh.position.x,e.mesh.position.y,e.mesh.position.z),e.body.quaternion.set(e.mesh.quaternion.x,e.mesh.quaternion.y,e.mesh.quaternion.z,e.mesh.quaternion.w)})}makeGeom(e){const n=new G,s=[],a=[],c=[],l=.01,r=e.length,v=e.reduce((o,h)=>[o[0]+h[0],o[1]+h[1]],[0,0]),u=v[0]/r,d=v[1]/r;e.forEach(o=>{s.push(o[0]-u,o[1]-d,-l),a.push(o[0]/p,o[1]/x)}),e.forEach(o=>{s.push(o[0]-u,o[1]-d,l),a.push(o[0]/p,o[1]/x)});for(let o=1;o<r-1;o++)c.push(0,o,o+1);for(let o=1;o<r-1;o++)c.push(0+r,o+r,r+o+1);for(let o=0;o<r;o++){const h=o,z=(o+1)%r;c.push(h,z,h+r),c.push(z,z+r,h+r)}return n.setAttribute("position",new P(new Float32Array(s),3)),n.setAttribute("uv",new P(new Float32Array(a),2)),n.setIndex(c),{geom:n,x:u,y:d}}renderVoronoi(e){const n=document.createElement("canvas");document.body.appendChild(n),n.style.backgroundColor="#ccc",n.width=p,n.height=x;const s=n.getContext("2d");s.beginPath(),e.render(s),s.lineWidth=.25,s.strokeStyle="#ff0000",s.fillStyle="#ffff33",s.stroke()}}class ae{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new m;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const n=new f(2,2),s=new q({...K});this.mesh=new y(n,s),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var ce=`uniform float uTime;

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
  float time = uTime * .001;
  vec2 uv = vUv * 5.;
  vec3 col = vec3(0);
  float n = snoise(vec3(uv, time));
  col = vec3(n);
  oColor = vec4(col, 1.);
}`,he=`out vec2 vUv;
out vec3 vPos;

void main() {
  vUv = uv;
  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class de{constructor(){t(this,"renderer");t(this,"camera");t(this,"target");t(this,"mesh");const e=new m;this.renderer=e.renderer,this.camera=e.oCamera,this.target=new w(e.size.width,e.size.height,{type:j});const n=new f(2,2),s=new q({glslVersion:C,fragmentShader:ce,vertexShader:he,uniforms:{uTime:{value:0}}});this.mesh=new y(n,s)}get texture(){return this.target.texture}render(){this.mesh.material.uniforms.uTime.value+=1,this.renderer.setRenderTarget(this.target),this.renderer.render(this.mesh,this.camera)}}class le{constructor(){t(this,"scene1");t(this,"scene2");t(this,"scene3");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"target1");t(this,"target2");t(this,"target3");t(this,"heightMap");t(this,"panels");t(this,"voronoi");t(this,"background");t(this,"sphere");t(this,"fxaa");const e=new m;this.scene1=e.scene1,this.scene2=e.scene2,this.scene3=e.scene3,this.camera=e.camera,this.oCamera=e.oCamera,this.renderer=e.renderer,this.target1=new w(e.size.width,e.size.height),this.target2=new w(e.size.width,e.size.height),this.target3=new w(e.size.width,e.size.height),this.setUp()}setUp(){this.panels=new ne;const n=new L().load(["../envmap/px.jpg","../envmap/nx.jpg","../envmap/py.jpg","../envmap/ny.jpg","../envmap/pz.jpg","../envmap/nz.jpg"]);n.encoding=S,this.scene2.background=n,this.scene2.environment=n,this.sphere=new te,this.sphere.setBackground(n),this.heightMap=new de,this.voronoi=new re,this.background=new Y,this.fxaa=new ae}update(){this.heightMap.render(),this.sphere.setHeightMap(this.heightMap.texture),this.renderer.setRenderTarget(this.target2),this.renderer.render(this.scene2,this.camera),this.renderer.setRenderTarget(this.target1),this.panels.setTexture(this.target2.texture),this.renderer.render(this.scene1,this.camera),this.voronoi.update(),this.renderer.setRenderTarget(this.target3),this.voronoi.setTexture(this.target1.texture),this.background.setTexture(this.target2.texture),this.renderer.render(this.scene3,this.oCamera),this.fxaa.render(null,this.target3.texture)}onClick(e,n,s){e?(console.log(n,s),this.voronoi.start(n,s)):this.voronoi.reset()}resize(){}}let M;class m{constructor(e){t(this,"scene1");t(this,"scene2");t(this,"scene3");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"physics");t(this,"doPhysics",!1);t(this,"dd");t(this,"size");t(this,"debug");if(M)return M;!e||(M=this,this.init(e))}init(e){this.debug=new X,this.size={width:window.innerWidth*Math.min(2,devicePixelRatio),height:window.innerHeight*Math.min(2,devicePixelRatio)},this.scene1=new g,this.scene2=new g,this.scene3=new g,this.camera=new V(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0),this.oCamera=new W(-1,1,1,-1,.1,10),this.oCamera.position.set(0,0,3),this.oCamera.lookAt(0,0,0),this.renderer=new H({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=S,this.renderer.shadowMap.enabled=!0,this.physics=new N,this.physics.gravity.set(0,-0,0),this.world=new le;const n=new Z(this.camera,e);n.enableZoom=!1;const s=Math.PI/3*2,a=Math.PI/3;n.maxPolarAngle=s,n.minPolarAngle=a,n.maxAzimuthAngle=Math.PI/180*15,n.minAzimuthAngle=Math.PI/180*-15,this.render()}render(){this.debug.begin(),this.doPhysics&&this.physics.step(1/60),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}onClick(e,n){this.doPhysics=!this.doPhysics,this.world.onClick(this.doPhysics,e,n)}resize(){}}const ve=document.querySelector(".webgl"),A=new m(ve);window.addEventListener("resize",()=>{A.resize()});window.addEventListener("click",i=>{A.onClick(i.x/window.innerWidth*2-1,(1-i.y/window.innerHeight)*2-1)});
