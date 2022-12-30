var b=Object.defineProperty;var x=(n,e,s)=>e in n?b(n,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[e]=s;var t=(n,e,s)=>(x(n,typeof e!="symbol"?e+"":e,s),s);import{B as f,e as m,G as w,M as l,a2 as M,l as o,a3 as S,D as P,S as u,d as y,c as z,i as C,j as R,P as A,O as L,W as G,s as T}from"./three.module.ae74702b.js";import{O as U}from"./OrbitControls.9335f66a.js";import"./stats.min.46d05fb3.js";import{F as W}from"./FXAAShader.e40613ef.js";class O{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var v=`in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 uv = vUv;
    uv.x *= 8.;
    vec2 grid = fract(uv * 10.);
    oColor = vec4(grid,.0, 1.);
}`,p=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class D{constructor(){t(this,"scene");t(this,"geom");t(this,"mat");t(this,"mesh");const e=new h;this.scene=e.scene,this.setUp()}setUp(){this.geom=new f(1,1),this.mat=new m({fragmentShader:v,vertexShader:p,glslVersion:w}),this.mesh=new l(this.geom,this.mat),this.scene.add(this.mesh)}update(){this.mesh.rotation.y+=.01}}class F extends M{constructor(e=10){super(),this.scale=e}getPoint(e,s=new o){const i=s;e*=Math.PI*2;const r=(2+Math.cos(3*e))*Math.cos(2*e),a=(2+Math.cos(3*e))*Math.sin(2*e),c=Math.sin(3*e);return i.set(r,a,c).multiplyScalar(this.scale)}}const g=1e3;class V{constructor(){t(this,"scene");t(this,"camera");t(this,"mesh");t(this,"vec");t(this,"curve");const e=new h;this.scene=e.scene,this.camera=e.camera;const s=new F;this.curve=s;const i=new S(this.curve,256,8,32),r=new m({glslVersion:w,fragmentShader:v,vertexShader:p,side:P});this.mesh=new l(i,r),this.scene.add(this.mesh),this.vec={position:new o(0,0,0),tangent:new o(0,0,0),binormal:new o(0,0,0),normal:new o(0,0,0),target:new o(0,0,0)}}updateCamera(e){const s=e%g/g;this.curve.getPointAt(s,this.vec.position);const i=this.mesh.geometry,r=s*i.tangents.length,a=Math.floor(r),c=(a+1)%i.tangents.length;this.vec.binormal.subVectors(i.binormals[c],i.binormals[a]),this.vec.binormal.multiplyScalar(r-a).add(i.binormals[a]),i.parameters.path.getTangentAt(s,this.vec.tangent),this.vec.normal.copy(this.vec.binormal).cross(this.vec.tangent),this.vec.position.add(this.vec.normal.clone().multiplyScalar(-4)),this.camera.position.copy(this.vec.position),i.parameters.path.getPointAt((s+30/i.parameters.path.getLength())%1,this.vec.tangent),this.vec.target.copy(this.vec.position).add(this.vec.tangent),this.camera.matrix.lookAt(this.vec.position,this.vec.tangent,this.vec.normal),this.camera.quaternion.setFromRotationMatrix(this.camera.matrix)}}class k{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new h;this.scene=new u,this.camera=e.oCamera,this.renderer=e.renderer;const s=new y(2,2),i=new m({...W});this.mesh=new l(s,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,s){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=s,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}class q{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"target");t(this,"sample");t(this,"tube");t(this,"fxaa");const e=new h;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.target=new z(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio)),this.setUp()}setUp(){const e=new C(16777215,.3);this.scene.add(e);const s=new R(2245870,1);this.scene.add(s),this.sample=new D,this.tube=new V,this.fxaa=new k}update(e){this.sample.update(),this.tube.updateCamera(e),this.renderer.setRenderTarget(this.target),this.renderer.render(this.scene,this.camera),this.fxaa.render(null,this.target.texture)}resize(){}}let d;class h{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(d)return d;!e||(d=this,this.init(e))}init(e){this.debug=new O,this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new u,this.camera=new A(45,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,3),this.oCamera=new L(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new G({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=T,this.world=new q,new U(this.camera,e),this.render(0)}render(e){this.debug.begin(),this.world.update(e),this.debug.end(),requestAnimationFrame(()=>this.render(e+1))}resize(){}}const B=document.querySelector(".webgl"),E=new h(B);window.addEventListener("resize",()=>{E.resize()});
