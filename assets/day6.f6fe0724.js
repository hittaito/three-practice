var f=Object.defineProperty;var w=(i,e,t)=>e in i?f(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var s=(i,e,t)=>(w(i,typeof e!="symbol"?e+"":e,t),t);import{$ as d,e as m,G as u,D as g,M as l,p,Z as b,a6 as R,a7 as x,a8 as z,s as v,a9 as C,S as P,P as F,W as M}from"./three.module.ae74702b.js";import{S,E as y,R as I}from"./SMAAPass.a1f27cfc.js";import"./stats.min.46d05fb3.js";class B{constructor(){s(this,"ui");s(this,"stats");s(this,"status");this.status="OFF"}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var U=`in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 uv = vUv;
    uv = mod(uv*30.,1.);
    oColor = vec4(uv,.0, 1.);
}`,G=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class L{constructor(){s(this,"scene");s(this,"mesh");const e=new a;this.scene=e.scene,this.setUp()}setUp(){const e=new d(4,32,32),t=new m({fragmentShader:U,vertexShader:G,glslVersion:u,side:g});this.mesh=new l(e,t),this.scene.add(this.mesh)}update(){}}var W=`uniform samplerCube uCubeImg;

in vec3 vReflect;
in vec3 vRefract[3];
in float vReflectionFactor;

out vec4 oColor;

void main() {

    vec4 reflectedColor = textureCube( uCubeImg, vec3( -vReflect.x, vReflect.yz ) );
    vec4 refractedColor = vec4( 1.0 );

    refractedColor.r = textureCube( uCubeImg, vec3( vRefract[0].x, vRefract[0].yz ) ).r;
    refractedColor.g = textureCube( uCubeImg, vec3( vRefract[1].x, vRefract[1].yz ) ).g;
    refractedColor.b = textureCube( uCubeImg, vec3( vRefract[2].x, vRefract[2].yz ) ).b;

    oColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
    
}`,N=`uniform float uRefractionRatio;
uniform float uFresnelBias;
uniform float uFresnelScale;
uniform float uFresnelPower;

out vec3 vReflect;
out vec3 vRefract[3];
out float vReflectionFactor;

void main() {
  float mRefractionRatio = uRefractionRatio;
  float mFresnelBias = uFresnelBias;
  float mFresnelScale = uFresnelScale;
  float mFresnelPower = uFresnelPower;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec3 worldNormal = normalize(
      mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) *
      normal);

  vec3 I = worldPosition.xyz - cameraPosition;

  vReflect = reflect(I, worldNormal);
  vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio);
  vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.99);
  vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.98);
  vReflectionFactor =
      mFresnelBias +
      mFresnelScale * pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);

  gl_Position = projectionMatrix * mvPosition;
}`;class E{constructor(){s(this,"scene");s(this,"mesh");s(this,"target",{x:0,y:0});s(this,"debug");const e=new a;this.scene=e.scene,console.log(e.debug),this.debug=e.debug,this.setUp()}setUp(){const e=new d(.7,32,32),t=new m({fragmentShader:W,vertexShader:N,glslVersion:u,uniforms:{uCubeImg:{value:null},uRefractionRatio:{value:1.05},uFresnelBias:{value:0},uFresnelScale:{value:.7},uFresnelPower:{value:1}}});if(this.mesh=new l(e,t),this.scene.add(this.mesh),console.log(this.debug),this.debug.status==="ON"){console.log("on");const n=this.debug.ui.addFolder("fresnel");n.add(t.uniforms.uRefractionRatio,"value",1,1.1,1e-4).name("refractionRatio"),n.add(t.uniforms.uFresnelBias,"value",0,4,.001).name("fresnelBias"),n.add(t.uniforms.uFresnelScale,"value",0,2,.001).name("fresnelScale"),n.add(t.uniforms.uFresnelPower,"value",0,5,.001).name("fresnelPower")}}setImage(e){this.mesh.material.uniforms.uCubeImg.value=e}update(){const e=this.mesh.position.x,t=this.mesh.position.y;this.mesh.position.x+=(this.target.x-e)*.1,this.mesh.position.y+=(this.target.y-t)*.1}moveSphere(e,t){this.target.x=e,this.target.y=t}}class H{constructor(){s(this,"scene");s(this,"camera");s(this,"renderer");s(this,"cubeCamera");s(this,"composer");s(this,"sample");s(this,"box");s(this,"sphere");s(this,"aa");s(this,"angle",0);const e=new a;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.composer=e.composer,this.setUp()}setUp(){this.box=new L,this.sphere=new E;const e=new p(1,2),t=new b({color:"skyblue"});this.aa=new l(e,t),this.aa.position.z+=3,this.scene.add(this.aa);const n=new R(512*2,{format:x,generateMipmaps:!0,minFilter:z,encoding:v});this.cubeCamera=new C(.1,10,n);const r=new S(window.innerWidth*this.renderer.getPixelRatio(),window.innerHeight*this.renderer.getPixelRatio());this.composer.addPass(r),this.sphere.setImage(n.texture)}update(){this.angle+=.01,this.aa.position.z=Math.cos(this.angle)*4,this.aa.position.x=Math.sin(this.angle)*4,this.sphere.update(),this.sphere.mesh.visible=!1,this.cubeCamera.position.x=this.sphere.mesh.position.x,this.cubeCamera.position.y=this.sphere.mesh.position.y,this.cubeCamera.update(this.renderer,this.scene),this.sphere.mesh.visible=!0}mouseMove(e,t){this.sphere.moveSphere(e,t)}resize(){}}let c;class a{constructor(e){s(this,"scene");s(this,"camera");s(this,"renderer");s(this,"composer");s(this,"world");s(this,"size");s(this,"debug");s(this,"viewHeight",4);if(c)return c;!e||(c=this,this.init(e))}init(e){this.debug=new B,console.log(this.debug),this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new P;const t=60,n=this.viewHeight/2/Math.tan(t/2*Math.PI/180);this.camera=new F(t,this.size.width/this.size.height,.1,100),this.camera.position.set(0,0,n),this.renderer=new M({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=v,this.composer=new y(this.renderer);const r=new I(this.scene,this.camera);this.composer.addPass(r),this.world=new H,this.render()}render(){this.debug.begin(),this.world.update(),this.composer.render(),this.debug.end(),requestAnimationFrame(()=>this.render())}mouseMove(e,t){const n=this.size.width/this.size.height,r=this.viewHeight/2;this.world.mouseMove(n*r*e,r*t)}resize(){this.size={width:window.innerWidth,height:window.innerHeight},this.camera.aspect=this.size.width/this.size.height,this.camera.updateProjectionMatrix(),this.composer.setSize(this.size.width,this.size.height),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))}}const o=document.querySelector(".webgl"),h=new a(o);window.addEventListener("resize",()=>{console.log("resize"),h.resize()});o.addEventListener("mousemove",i=>{const e=o.width,t=o.height;h&&h.mouseMove(i.clientX/e*2-1,(1-i.clientY/t)*2-1)});
