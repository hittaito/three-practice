var l=Object.defineProperty;var u=(n,e,t)=>e in n?l(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var i=(n,e,t)=>(u(n,typeof e!="symbol"?e+"":e,t),t);import{S as f,P as d,W as g,c as v,j as x,i as p,B as S,ab as w,M as a,O as z,F as b,N as o,d as C,R as m,G as c}from"./three.module.9352233f.js";import{O as T}from"./OrbitControls.e80330a0.js";var h=`uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,F=`precision highp float;

uniform sampler2D img;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 texSize = vec2(textureSize(img, 0));
    vec2 invTexSize = 1. / texSize;

    vec2 uv = vUv * texSize;
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    i += step(.5, f);
    f -= (step(.5, f) * 2. - 1.) * .5;

    vec4 v00 = texture(img, (i + vec2(-.5, -.5)) * invTexSize);
    vec4 v10 = texture(img, (i + vec2( .5, -.5)) * invTexSize);
    vec4 v01 = texture(img, (i + vec2(-.5,  .5)) * invTexSize);
    vec4 v11 = texture(img, (i + vec2( .5,  .5)) * invTexSize);
    oColor = mix(mix(v00, v10, f.x),mix(v01, v11, f.x), f.y);
}`,M=`precision highp float;

uniform sampler2D img;
uniform bool horizontal;
uniform int steps;

in vec2 vUv;

out vec4 oColor;

const float[5] w = float[](0.2270270, 0.1945945, 0.1216216, 0.0540540, 0.0162162);

ivec2 clampCoord(ivec2 coord, ivec2 size) {
    return max(min(coord, size - 1), 0);
}

void main(void) {
    ivec2 texSize = ivec2(gl_FragCoord.xy);
    ivec2 size = textureSize(img, 0);
    vec3 sum = w[0] * texelFetch(img, texSize, 0).rgb;
    for (int i = 1; i < 5; i++) {
        ivec2 offset = (horizontal ? ivec2(i, 0) : ivec2(0, i)) * steps;
        sum += w[i] * texelFetch(img, clampCoord(texSize + offset, size), 0).rgb;
        sum += w[i] * texelFetch(img, clampCoord(texSize - offset, size), 0).rgb;
  }
    oColor = vec4(sum,1.);
}`;class R{constructor(){i(this,"scene");i(this,"camera");i(this,"renderer");i(this,"offScreen");i(this,"control");i(this,"gauss")}init(){this.scene=new f,this.camera=new d(75,innerWidth/innerHeight,.1,1e3),this.camera.position.set(0,0,5),this.camera.lookAt(0,0,0),this.renderer=new g({antialias:!1}),this.renderer.setSize(innerWidth,innerHeight),this.control=new T(this.camera,this.renderer.domElement),document.body.appendChild(this.renderer.domElement),this.offScreen=new v(innerWidth,innerHeight);const e=new x(16777215);e.position.set(.8,1,.1),this.scene.add(e);const t=new p(3355443);this.scene.add(t);const r=new S(1,2,3),s=new w({color:10035950});this.scene.add(new a(r,s)),this.gauss=new y,this.gauss.init(),this.render()}render(){this.renderer.setRenderTarget(this.offScreen),this.renderer.render(this.scene,this.camera),this.gauss.render(this.renderer,this.offScreen.texture,null),requestAnimationFrame(()=>this.render())}}class y{constructor(){i(this,"buffers");i(this,"camera");i(this,"mesh1");i(this,"mesh2");i(this,"active",0);i(this,"m1");i(this,"m2")}init(){this.camera=new z(-1,1,1,-1,1,10),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0);const e=new v(innerWidth/4,innerHeight/4);e.texture.type=b,e.texture.minFilter=o,e.texture.magFilter=o,this.buffers=[e,e.clone()];const t=new C(2,2);this.m1=new m({vertexShader:h,fragmentShader:F,uniforms:{img:{value:null}},glslVersion:c}),this.mesh1=new a(t,this.m1),this.m2=new m({vertexShader:h,fragmentShader:M,uniforms:{img:{value:null},horizontal:{value:!1},steps:{value:1}},glslVersion:c}),this.mesh2=new a(t,this.m2)}render(e,t,r){e.setRenderTarget(this.buffers[this.active]),this.m1.uniforms.img.value=t,e.render(this.mesh1,this.camera);for(let s=0;s<8;s++)e.setRenderTarget(this.buffers[1-this.active]),this.m2.uniforms.img.value=this.buffers[this.active].texture,this.m2.uniforms.horizontal.value=this.active===0,e.render(this.mesh2,this.camera),this.active=1-this.active;e.setRenderTarget(r),this.m1.uniforms.img.value=this.buffers[this.active].texture,e.render(this.mesh1,this.camera)}}const G=new R;G.init();
