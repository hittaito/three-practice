var y=Object.defineProperty;var f=(o,r,t)=>r in o?y(o,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[r]=t;var c=(o,r,t)=>(f(o,typeof r!="symbol"?r+"":r,t),t);import{S as u,P as M,W as A,R as D,G as z,M as b,y as S,a1 as a}from"./three.module.89134fd5.js";import{O as G}from"./OrbitControls.4f0c683d.js";var W=`precision highp float;

out vec4 oColor;

void main(void) {
    oColor = vec4(1.,.3,.0, 1.);
}`,C=`uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

in vec3 position;
in vec3 prevPos;
in vec3 nextPos;
in float sign;

void main() {
    vec4 wPos = modelMatrix * vec4(position, 1.);
    vec4 pwPos = modelMatrix * vec4(prevPos, 1.);
    vec4 nwPos = modelMatrix * vec4(nextPos, 1.);

    vec3 prevDir = wPos.xyz - pwPos.xyz;
    prevDir = length(prevDir) > 1e-8 ? normalize(prevDir) : vec3(0.);
    vec3 nextDir = nwPos.xyz - wPos.xyz;
    nextDir = length(nextDir) > 1e-8 ? normalize(nextDir) : vec3(0.);

    vec3 posDir = prevDir + nextDir;
    vec3 viewDir = cameraPosition - wPos.xyz;
    vec3 norm = cross(viewDir, posDir);
    norm = length(norm) > 1e-8 ? normalize(norm) : vec3(0.);
    wPos.xyz += .5 * sign * norm;

    gl_Position = projectionMatrix * viewMatrix * wPos;
}`;const m=1e3;class F{constructor(){c(this,"scene");c(this,"camera");c(this,"renderer")}init(){this.scene=new u,this.camera=new M(75,innerWidth/innerHeight,.1,1e3),this.camera.lookAt(0,0,0),this.camera.position.set(0,0,300),this.renderer=new A({antialias:!0}),this.renderer.setSize(innerWidth,innerHeight),new G(this.camera,this.renderer.domElement),document.body.appendChild(this.renderer.domElement);const r=this.setGeometry(),t=new D({fragmentShader:W,vertexShader:C,glslVersion:z}),n=new b(r,t);this.scene.add(n),console.log("en"),console.log(n.matrixWorld),console.log(this.camera.matrixWorldInverse),console.log(this.camera.projectionMatrix),this.render()}render(){this.renderer.render(this.scene,this.camera),requestAnimationFrame(()=>this.render())}setGeometry(){const r=2*m,t=6*(m-1),n=new Array(r*3),l=new Array(r),i=new Uint16Array(t);for(let e=0;e<m;e++){const h=50*Math.sin(.032*e+.35)*Math.sin(-.029*e+4.86),w=50*Math.sin(e*.041-1.96),x=50*Math.sin(e*.078-5.21);n[e*6]=h,n[e*6+1]=w,n[e*6+2]=x,n[e*6+3]=h,n[e*6+4]=w,n[e*6+5]=x,l[2*e]=1,l[2*e+1]=-1}for(let e=0;e<m-1;++e)i[6*e]=2*e,i[6*e+1]=i[6*e+5]=2*e+1,i[6*e+2]=i[6*e+4]=2*e+2,i[6*e+3]=2*e+3;const p=[...n],v=n.splice(0,3),d=n.splice(n.length-3,3),P=[...v,...v,...n],g=[...n,...d,...d],s=new S;return s.setAttribute("position",new a(new Float32Array(p),3)),s.setAttribute("prevPos",new a(new Float32Array(P),3)),s.setAttribute("nextPos",new a(new Float32Array(g),3)),s.setAttribute("sign",new a(new Float32Array(l),1)),s.setIndex(new a(new Uint16Array(i),1)),s}}const E=new F;E.init();
