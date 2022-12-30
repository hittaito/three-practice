var m=Object.defineProperty;var c=(o,e,t)=>e in o?m(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var n=(o,e,t)=>(c(o,typeof e!="symbol"?e+"":e,t),t);import{S as p,P as u,W as v,R as g,D as f,G as M,a as I,T as w,b as P,M as x}from"./three.module.ae74702b.js";var S=`precision highp float;

uniform sampler2D img;
uniform float alpha;

in vec2 vUv;
out vec4 oColor;

void main(void) {
    vec4 col = texture(img, vUv);
    float a = max(alpha, .1);
    oColor = vec4(col.xyz, a);
}`,b=`uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

in vec3 position;
in vec2 uv;

out vec2 vUv;

float PI = 3.1415;

void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(PI *uv.x)* .01;
    pos.z += sin(PI *uv.x)* .02;

    pos.y += sin(time * .02) * .04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;class E{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"nImage",10);n(this,"speed",0);n(this,"position",0);n(this,"rounded",0);n(this,"touch",0);n(this,"meshes",[]);n(this,"group")}init(){var e;this.scene=new p,this.camera=new u(75,innerWidth/innerHeight,.1,1e3),this.camera.lookAt(0,0,0),this.camera.position.set(0,0,4),this.renderer=new v({alpha:!0,antialias:!0}),this.renderer.setSize(innerWidth,innerHeight),(e=document.getElementById("container"))==null||e.appendChild(this.renderer.domElement),this.handleImages(),this.registerEvent(),this.render(0)}render(e){this.position+=this.speed,this.speed*=.8;const t=Math.PI*2/this.nImage;let i=this.position%t;i>0?i=i>t/2?t-i:-i:i=Math.abs(i)>t/2?t+i:-i,this.position+=i*.05,this.position=this.treatPI(this.position),this.group.rotation.x=this.position,this.meshes.forEach((r,s)=>{r.material.uniforms.time.value=e,r.material.uniformsNeedUpdate=!0;const h=t*s,d=Math.abs(this.position-h),a=Math.min(d,Math.PI*2-d)/Math.PI,l=Math.max(Math.exp(-a*a/.03),.4);r.material.uniforms.alpha.value=l,r.scale.set(l,l,l)}),this.renderer.render(this.scene,this.camera),requestAnimationFrame(()=>this.render(e+1))}treatPI(e){return e>2*Math.PI?e-2*Math.PI:e<0?e+2*Math.PI:e}handleImages(){const e=new g({fragmentShader:S,vertexShader:b,side:f,glslVersion:M,uniforms:{img:{value:null},time:{value:0},alpha:{value:1}}}),t=new I,i="https://dl.dropbox.com/s/bvpvd7798iyggz7/img3.jpg?dl=0",r="https://dl.dropbox.com/s/qsavljlq56etuvd/img2.jpg?dl=0";for(let s=0;s<this.nImage;s++){const h=e.clone();h.uniforms.img.value=new w().load(s%2===0?i:r),h.uniformsNeedUpdate=!0;const d=new P(1.5,1,20,20),a=new x(d,h);a.position.y=2*Math.sin(2*Math.PI*(s/this.nImage)),a.position.z=2*Math.cos(2*Math.PI*(s/this.nImage)),a.rotation.x=-2*Math.PI*(s/this.nImage),t.add(a),this.scene.add(t),this.meshes.push(a)}this.group=t}registerEvent(){window.addEventListener("wheel",e=>{this.speed+=e.deltaY*4e-4}),window.addEventListener("touchmove",e=>{const t=e.targetTouches[0].clientY-this.touch;this.speed+=t*4e-4,this.touch=e.targetTouches[0].clientY}),window.addEventListener("resize",()=>{this.renderer.setSize(innerWidth,innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()})}}const y=new E;y.init();
