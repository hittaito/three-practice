var d=Object.defineProperty;var g=(t,e,n)=>e in t?d(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var i=(t,e,n)=>(g(t,typeof e!="symbol"?e+"":e,n),n);import{S as c,P as x,W as p,c as f,j as w,i as S,B as z,a0 as b,M as m,O as C,F as T,N as h,d as F,R as v,G as l}from"./three.module.89134fd5.js";import{O as M}from"./OrbitControls.4f0c683d.js";var u=`uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,R=`precision highp float;

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
}`,y=`precision highp float;

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
}`;class G{constructor(){i(this,"scene");i(this,"camera");i(this,"renderer");i(this,"offScreen");i(this,"control");i(this,"gauss")}init(){this.scene=new c,this.camera=new x(75,innerWidth/innerHeight,.1,1e3),this.camera.position.set(0,0,5),this.camera.lookAt(0,0,0),this.renderer=new p({antialias:!1}),this.renderer.setSize(innerWidth,innerHeight),this.control=new M(this.camera,this.renderer.domElement),document.body.appendChild(this.renderer.domElement),this.offScreen=new f(innerWidth,innerHeight);const e=new w(16777215);e.position.set(.8,1,.1),this.scene.add(e);const n=new S(3355443);this.scene.add(n);const s=new z(1,2,3),r=new b({color:10035950});this.scene.add(new m(s,r)),this.gauss=new L,this.gauss.init(),this.render()}render(){this.renderer.setRenderTarget(this.offScreen),this.renderer.render(this.scene,this.camera),this.gauss.render(this.renderer,this.offScreen.texture,null),requestAnimationFrame(()=>this.render())}}class L{constructor(){i(this,"buffers");i(this,"camera");i(this,"scene1");i(this,"scene2");i(this,"m1");i(this,"m2")}init(){this.camera=new C(-1,1,1,-1,1,10),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0);const e=new f(innerWidth/4,innerHeight/4);e.texture.type=T,e.texture.minFilter=h,e.texture.magFilter=h,this.buffers=[e,e.clone()],this.scene1=new c,this.scene2=new c;const n=new F(2,2);this.m1=new v({vertexShader:u,fragmentShader:R,uniforms:{img:{value:null}},glslVersion:l}),this.scene1.add(new m(n,this.m1)),this.m2=new v({vertexShader:u,fragmentShader:y,uniforms:{img:{value:null},horizontal:{value:!1},steps:{value:1}},glslVersion:l}),this.scene2.add(new m(n,this.m2))}render(e,n,s){e.setRenderTarget(this.buffers[1]),this.m1.uniforms.img.value=n,e.render(this.scene1,this.camera);let r=0;for(let a=0;a<8;a++){const o=a%2;e.setRenderTarget(this.buffers[o]),this.m2.uniforms.img.value=this.buffers[1-o].texture,this.m2.uniforms.horizontal.value=o===0,e.render(this.scene2,this.camera)}e.setRenderTarget(s),this.m1.uniforms.img.value=this.buffers[r].texture,e.render(this.scene1,this.camera)}}const W=new G;W.init();
