var x=Object.defineProperty;var C=(s,e,t)=>e in s?x(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>(C(s,typeof e!="symbol"?e+"":e,t),t);import{S as r,P as w,W as D,d as f,R as l,G as c,M as m,O as S,u as d,N as v,F,c as y,a5 as U}from"./three.module.da3d5bd6.js";import{w as H}from"./webfontloader.8f02c34e.js";var z=`precision highp float;

uniform sampler2D img;

in vec2 vUv;
out vec4 oColor;

void main(void) {
    vec4 col = texture(img, vUv);
    oColor = vec4(vec3(col.x),1.);
}`,h=`uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,T=`precision highp float;

#define SQRT2 1.41421356237
#define CH r

uniform sampler2D img;

in vec2 vUv;

layout(location = 0) out vec4 outColor1;
layout(location = 1) out vec4 outColor2;

vec2 ComputeEdgeGradients(ivec2 pos) {
    float g =
        - texelFetch(img, pos + ivec2(-1,-1), 0).CH
        - texelFetch(img, pos + ivec2(-1, 1), 0).CH
        + texelFetch(img, pos + ivec2( 1,-1), 0).CH
        + texelFetch(img, pos + ivec2( 1, 1), 0).CH;

    return normalize(vec2(
        g + (texelFetch(img, pos + ivec2(1, 0), 0).CH - texelFetch(img, pos + ivec2(-1, 0), 0).CH) * SQRT2,
        g + (texelFetch(img, pos + ivec2(0, 1), 0).CH - texelFetch(img, pos + ivec2(0, -1), 0).CH) * SQRT2
    ));
}
vec2 sobel(ivec2 pos) {
    float l1 = texelFetch(img, pos + ivec2(-1, 1), 0).CH;
    float l2 = texelFetch(img, pos + ivec2(-1, 0), 0).CH;
    float l3 = texelFetch(img, pos + ivec2(-1, -1), 0).CH;

    float t = texelFetch(img, pos + ivec2(0, 1), 0).CH;
    float b = texelFetch(img, pos + ivec2(0, -1), 0).CH;

    float r1 = texelFetch(img, pos + ivec2(1, 1), 0).CH;
    float r2 = texelFetch(img, pos + ivec2(1, 0), 0).CH;
    float r3 = texelFetch(img, pos + ivec2(1, -1), 0).CH;

    return vec2(1.);
}
float ApproximateEdgeDelta(vec2 grad, float a)
{
    if (grad.x == 0.0 || grad.y == 0.0) {
        return 0.5 - a;
    }
    grad = abs(normalize(grad));
    float gmax = max(grad.x, grad.y);
    float gmin = min(grad.x, grad.y);

    float a1 = 0.5 * gmin / gmax;
    if (a < a1) {
        return 0.5 * (gmax + gmin) - sqrt(2.0 * gmax * gmin * a);
    }
    if (a < (1.0 - a1)) {
        return (0.5 - a) * gmax;
    }
    return -0.5 * (gmax + gmin) + sqrt(2.0 * gmax * gmin * (1.0 - a));
}
float InitializeDistance(vec2 grad, float alpha)
{
    if (alpha <= 0.) {
        return 1000.0;
    } else if (alpha < 1.0) {
        return ApproximateEdgeDelta(grad, alpha);
    } else {
        return 0.0;
    }
}

void main() {
    ivec2 pos = ivec2(vUv * vec2(textureSize(img, 0)));

    vec2 grad = ComputeEdgeGradients(pos);
    float alpha = texelFetch(img, pos, 0).CH;

    outColor1.xy = vec2(0.0);
    outColor1.z = InitializeDistance(-grad, 1.0 - alpha);
    outColor1.a = 1.0 - alpha;

    outColor2.xy = vec2(alpha);
    outColor2.z = InitializeDistance(grad, alpha);
    outColor2.a = alpha;
}`,E=`precision highp float;

uniform sampler2D img1;
uniform sampler2D img2;

in vec2 vUv;

layout(location = 0) out vec4 outColor1;
layout(location = 1) out vec4 outColor2;

float ApproximateEdgeDelta(vec2 grad, float a) {
    if (grad.x == 0.0 || grad.y == 0.0) {
        return 0.5 - a;
    }
    grad = abs(normalize(grad));
    float gmax = max(grad.x, grad.y);
    float gmin = min(grad.x, grad.y);

    float a1 = 0.5 * gmin / gmax;
    if (a < a1) {
        return 0.5 * (gmax + gmin) - sqrt(2.0 * gmax * gmin * a);
    }
    if (a < (1.0 - a1)) {
        return (0.5 - a) * gmax;
    }
    return -0.5 * (gmax + gmin) + sqrt(2.0 * gmax * gmin * (1.0 - a));
}

vec4 UpdateDistance(vec4 p, ivec2 pos, ivec2 o, sampler2D img) {
    vec4 neighbor = texelFetch(img, pos + o, 0);
    ivec2 ndelta = ivec2(neighbor.xy);
    vec4 closest = texelFetch(img, pos + o - ndelta, 0);

    if (closest.a == .0 || o == ndelta) {
        return p;
    }
    vec2 delta = neighbor.xy - vec2(o);
    float dist = length(delta) + ApproximateEdgeDelta(delta, closest.a);
     if (dist < p.z) {
        p.xy = delta;
        p.z = dist;
     }
    return p;
}
vec4 calc(sampler2D img) {
    ivec2 pos = ivec2(vUv * vec2(textureSize(img, 0)));
    vec4 p = texelFetch(img, pos, 0);

    if (p.z > 0.0) {
        p = UpdateDistance(p, pos, ivec2(-1,  0), img);
        p = UpdateDistance(p, pos, ivec2(-1, -1), img);
        p = UpdateDistance(p, pos, ivec2( 0, -1), img);
        p = UpdateDistance(p, pos, ivec2( 1, -1), img);
        p = UpdateDistance(p, pos, ivec2( 1,  0), img);
        p = UpdateDistance(p, pos, ivec2( 1,  1), img);
        p = UpdateDistance(p, pos, ivec2( 0,  1), img);
        p = UpdateDistance(p, pos, ivec2(-1,  1), img);
    }
    return p;
}

void main() {
    outColor1 = calc(img1);
    outColor2 = calc(img2);
}`,M=`precision highp float;

#define INSIDE 32.
#define OUTSIDE 32.

uniform sampler2D img1;
uniform sampler2D img2;

in vec2 vUv;

out vec4 outColor;

void main() {
    float inside = texture(img1, vUv).z;
    float outside = texture(img2, vUv).z;

    float dist =  (clamp(inside / INSIDE, .0, 1.) - clamp(outside / OUTSIDE, .0, 1.)) ;

    outColor = vec4(clamp(dist, 0.,1.));
}`;const i=512*2;class A{constructor(){n(this,"scene");n(this,"camera");n(this,"sdf");n(this,"t");n(this,"panel");n(this,"renderer")}init(){this.scene=new r,this.camera=new w(75,innerWidth/innerHeight,.1,1e3),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0),this.renderer=new D({alpha:!1}),this.renderer.setSize(innerWidth,innerHeight),document.body.appendChild(this.renderer.domElement);const e=new b;e.loadfont().then(()=>{this.setUp(e)}),setInterval(()=>{const t=Math.floor(Math.random()*10)+4,a="\u3042\u3044\u3046\u3048\u304A\u304B\u304D\u304F\u3051\u3053\u3055\u3057\u3059\u305B\u305D\u6F22\u5B57\u30AB\u30C3\u30B3\u30A4\u30A4",o=Array.from(Array(t)).map(()=>a[Math.floor(Math.random()*a.length)]).join("");e.update(o)},1e3)}setUp(e){e.text="\u3042\u3044\u3046\u3048\u304A\u304B\u304D\u304F\u3051\u3053\u3055\u3057\u3059\u305B\u305D\u305F",this.sdf=new R,this.sdf.init(e.texture);const t=new f(10,10),a=new l({fragmentShader:z,vertexShader:h,glslVersion:c,uniforms:{img:{value:this.sdf.target.texture}}});this.panel=new m(t,a),this.scene.add(this.panel),this.render()}render(){this.sdf.update(this.renderer),this.panel.material.uniforms.img.value=this.sdf.target.texture,this.renderer.render(this.scene,this.camera),requestAnimationFrame(()=>this.render())}}class R{constructor(){n(this,"scene1");n(this,"scene2");n(this,"scene3");n(this,"mesh1");n(this,"mesh2");n(this,"mesh3");n(this,"camera");n(this,"t");n(this,"mrts");n(this,"target")}init(e){this.t=e,this.scene1=new r,this.scene2=new r,this.scene3=new r,this.camera=new S(-1,1,1,-1,1,10),this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0),this.mrts=[new d(i,i,2),new d(i,i,2)],this.mrts.forEach(u=>{u.texture.forEach(p=>{p.minFilter=v,p.magFilter=v,p.type=F})}),this.target=new y(i,i);const t=new f(2,2),a=new l({fragmentShader:T,vertexShader:h,uniforms:{img:{value:e}},glslVersion:c});this.mesh1=new m(t,a),this.scene1.add(this.mesh1);const o=new l({fragmentShader:E,vertexShader:h,uniforms:{img1:{value:null},img2:{value:null}},glslVersion:c});this.mesh2=new m(t,o),this.scene2.add(this.mesh2);const g=new l({fragmentShader:M,vertexShader:h,uniforms:{img1:{value:null},img2:{value:null}},glslVersion:c});this.mesh3=new m(t,g),this.scene3.add(this.mesh3)}update(e){e.setSize(i,i),e.setRenderTarget(this.mrts[0]),e.render(this.scene1,this.camera);let t=0;for(let a=0;a<12;a++)t=a%2,e.setRenderTarget(this.mrts[1-t]),this.mesh2.material.uniforms.img1.value=this.mrts[t].texture[0],this.mesh2.material.uniforms.img2.value=this.mrts[t].texture[1],e.render(this.scene2,this.camera);e.setRenderTarget(this.target),this.mesh3.material.uniforms.img1.value=this.mrts[1-t].texture[0],this.mesh3.material.uniforms.img2.value=this.mrts[1-t].texture[1],e.render(this.scene3,this.camera),e.setSize(window.innerWidth,window.innerHeight),e.setRenderTarget(null)}}class b{constructor(){n(this,"context");n(this,"texture");n(this,"_text","");this.init()}get text(){return this._text}set text(e){this._text=e,this.context&&this.update(e)}init(){const e=document.createElement("canvas");e.width=i,e.height=i,this.context=e.getContext("2d"),this.context.fillStyle="#329827",this.context.fillRect(0,0,i,i),this.texture=new U(e)}update(e){const t=i/Math.ceil(Math.sqrt(e.length));this.context.fillStyle="#000",this.context.fillRect(0,0,i,i),this.context.font=`bold ${t*.8}px 'Noto Sans JP'`,this.context.textAlign="center",this.context.fillStyle="#ffffff",e.split("").forEach((a,o)=>{const g=o%(i/t)*t+t/2,u=Math.floor(o/(i/t))*t+t*.9;this.context.fillText(a,g,u,t)}),this.texture.needsUpdate=!0}loadfont(){return new Promise(e=>{H.exports.load({google:{families:["Noto+Sans+JP:700"]},active:()=>e(null)})})}}const I=new A;I.init();
