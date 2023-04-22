var B=Object.defineProperty;var E=(i,e,r)=>e in i?B(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var t=(i,e,r)=>(E(i,typeof e!="symbol"?e+"":e,r),r);import{p as _,e as f,G as z,l as G,M as x,y as F,a1 as S,B as R,S as g,d as y,V as j,c as b,F as H,N as T,u as V,P as W,O as I,W as L,ag as X,s as k}from"./three.module.9352233f.js";import{O}from"./OrbitControls.e80330a0.js";import"./stats.min.46d05fb3.js";import{F as q}from"./FXAAShader.0b4b74a1.js";class N{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var M=`uniform float uSwitch;
uniform float uTime;
uniform vec3 uColor;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in vec2 vWPos;

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;

float map(float x1, float x2, float y1, float y2, float x) {
  return y1 + (y2 - y1) / (x2 - x1) * (x - x1);
}
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

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

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main(void) {
    vec3 dx = dFdx(vPosition);
    vec3 dy = dFdy(vPosition);
    vec3 n = normalize(cross(normalize(dx), normalize(dy)));
    vec3 bit = vec3(0.01);
    n = step(.5, uSwitch) * (n+bit);
    float rnd = snoise(vec3(vWPos * .1, uTime * .01));
    vec3 col = vec3(rnd) * uColor * .1;
    col = uColor * .1 * (sin(vWPos.y * .3 + uTime * .1) + 1.) * .5;
    oColor0 = vec4(map(-1.,1.,0.,1.,n.x),map(-1.,1.,0.,1.,n.y),map(-1.,1.,0.,1.,n.z), 1.);
    oColor1 = vec4(col , .1);
}`,A=`in vec2 iPosition;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out vec2 vWPos;

void main() {
  vUv = uv;
  vWPos = iPosition;
  vNormal = normalMatrix * normal;
  vPosition = (modelMatrix * vec4(position, 1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;class Y{constructor(){t(this,"scene");t(this,"mesh");const e=new d;this.scene=e.scene,this.setUp()}setUp(){const e=new _(.3,1,4),r=new f({fragmentShader:M,vertexShader:A,glslVersion:z,uniforms:{uSwitch:{value:1},uTime:{value:0},uColor:{value:new G(1,0,0)}}});this.mesh=new x(e,r),this.scene.add(this.mesh)}on(){this.mesh.material.uniforms.uSwitch.value=1}off(){this.mesh.material.uniforms.uSwitch.value=0}update(){this.mesh.material.uniforms.uTime.value+=1}}function $(i,e=!1){const r=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),m=new Set(Object.keys(i[0].morphAttributes)),v={},h={},l=i[0].morphTargetsRelative,o=new F;let p=0;for(let s=0;s<i.length;++s){const a=i[s];let c=0;if(r!==(a.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in a.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;v[u]===void 0&&(v[u]=[]),v[u].push(a.attributes[u]),c++}if(c!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+". Make sure all geometries have the same number of attributes."),null;if(l!==a.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in a.morphAttributes){if(!m.has(u))return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+".  .morphAttributes must be consistent throughout all geometries."),null;h[u]===void 0&&(h[u]=[]),h[u].push(a.morphAttributes[u])}if(o.userData.mergedUserData=o.userData.mergedUserData||[],o.userData.mergedUserData.push(a.userData),e){let u;if(r)u=a.index.count;else if(a.attributes.position!==void 0)u=a.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index "+s+". The geometry must have either an index or a position attribute"),null;o.addGroup(p,u,s),p+=u}}if(r){let s=0;const a=[];for(let c=0;c<i.length;++c){const u=i[c].index;for(let w=0;w<u.count;++w)a.push(u.getX(w)+s);s+=i[c].attributes.position.count}o.setIndex(a)}for(const s in v){const a=C(v[s]);if(!a)return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the "+s+" attribute."),null;o.setAttribute(s,a)}for(const s in h){const a=h[s][0].length;if(a===0)break;o.morphAttributes=o.morphAttributes||{},o.morphAttributes[s]=[];for(let c=0;c<a;++c){const u=[];for(let D=0;D<h[s].length;++D)u.push(h[s][D][c]);const w=C(u);if(!w)return console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the "+s+" morphAttribute."),null;o.morphAttributes[s].push(w)}}return o}function C(i){let e,r,n,m=0;for(let l=0;l<i.length;++l){const o=i[l];if(o.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=o.array.constructor),e!==o.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(r===void 0&&(r=o.itemSize),r!==o.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=o.normalized),n!==o.normalized)return console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;m+=o.array.length}const v=new e(m);let h=0;for(let l=0;l<i.length;++l)v.set(i[l].array,h),h+=i[l].array.length;return new S(v,r,n)}class J{constructor(){t(this,"scene");t(this,"mesh");const e=new d;this.scene=e.scene,this.setUp()}setUp(){const n=[];for(let h=0;h<100;h++)for(let l=0;l<20;l++){const o=new R(1,1,1);o.translate(1.5*(h-100/2),-1.5,1.5*(l-20/2));const p=o.getAttribute("position").count,s=new Float32Array(p*2);for(let c=0;c<p;c++)s[c*2+0]=1.5*(h-100/2),s[c*2+1]=1.5*(l-20/2);o.setAttribute("iPosition",new S(s,2)),n.push(o);const a=new R(1,1,1);a.translate(1.5*(h-100/2),1.5,1.5*(l-20/2)),a.setAttribute("iPosition",new S(s,2)),n.push(a)}const m=$(n),v=new f({fragmentShader:M,vertexShader:A,glslVersion:z,uniforms:{uSwitch:{value:1},uTime:{value:0},uColor:{value:new G(0,0,1)}}});this.mesh=new x(m,v),this.mesh.position.x+=.5,this.mesh.rotation.y+=1e-4,this.mesh.rotation.x+=1e-4,this.scene.add(this.mesh)}on(){this.mesh.material.uniforms.uSwitch.value=1,this.mesh.visible=!0}off(){this.mesh.material.uniforms.uSwitch.value=0,this.mesh.visible=!1}update(){this.mesh.material.uniforms.uTime.value+=1}}const K={uniforms:{tDiffuse:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float l = luminance( texel.rgb );

			gl_FragColor = vec4( l, l, l, texel.w );

		}`};class Q{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new d;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const r=new y(2,2),n=new f({...K});this.mesh=new x(r,n),this.scene.add(this.mesh)}render(e,r){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=r,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}class Z{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new d;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const r=new y(2,2),n=new f({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, vUv);
            }`,uniforms:{tDiffuse:{value:null}}});this.mesh=new x(r,n),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDiffuse.value=e,this.renderer.render(this.scene,this.camera)}}var ee=`uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec3 uColor;
varying vec2 vUv;

void main() {

    vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

    const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); 
    const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); 

    float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
    float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
    float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;

    float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
    float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
    float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;

    float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
    float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
    float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;

    float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
        Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
        Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

    float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
        Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
        Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );
    G = step(0.02,G);

    gl_FragColor = vec4( vec3( G ) * uColor * .4, 1 );

}`;class P{constructor(e){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const r=new d;this.scene=new g,this.camera=r.oCamera,this.renderer=r.renderer;const n=new y(2,2),m=new f({uniforms:{tDiffuse:{value:null},opacity:{value:1},resolution:{value:new j},uColor:{value:e}},vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:ee});this.mesh=new x(n,m),this.mesh.material.uniforms.resolution.value.x=window.innerWidth*window.devicePixelRatio,this.mesh.material.uniforms.resolution.value.y=window.innerHeight*window.devicePixelRatio,this.scene.add(this.mesh)}render(e,r){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=r,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var te=`uniform sampler2D tDiffuse;
uniform sampler2D uImage;
varying vec2 vUv;

void main() {
    vec4 i1 = texture2D(tDiffuse, vUv);
    vec4 i2 = texture2D(uImage, vUv);
    vec3 col = i1.xyz + step(i1.x, .3) * i2.xyz;
    gl_FragColor = vec4(col, 1.);
}`;class re{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new d;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const r=new y(2,2),n=new f({uniforms:{tDiffuse:{value:null},opacity:{value:1},uImage:{value:null}},vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:te});this.mesh=new x(r,n),this.scene.add(this.mesh)}render(e,r,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.uImage.value=r,this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}class ie{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new d;this.scene=new g,this.camera=e.oCamera,this.renderer=e.renderer;const r=new y(2,2),n=new f({...q});this.mesh=new x(r,n),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,r){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=r,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var ne=`uniform sampler2D tDiffuse;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 texSize = vec2(textureSize(tDiffuse, 0));
    vec2 invTexSize = 1. / texSize;

    vec2 uv = vUv * texSize;
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    i += step(.5, f);
    f -= (step(.5, f) * 2. - 1.) * .5;

    vec4 v00 = texture(tDiffuse, (i + vec2(-.5, -.5)) * invTexSize);
    vec4 v10 = texture(tDiffuse, (i + vec2( .5, -.5)) * invTexSize);
    vec4 v01 = texture(tDiffuse, (i + vec2(-.5,  .5)) * invTexSize);
    vec4 v11 = texture(tDiffuse, (i + vec2( .5,  .5)) * invTexSize);
    oColor = mix(mix(v00, v10, f.x),mix(v01, v11, f.x), f.y);
}`,se=`precision highp float;

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
}`;class oe{constructor(){t(this,"scene1");t(this,"scene2");t(this,"camera");t(this,"renderer");t(this,"textures");t(this,"mesh1");t(this,"mesh2");const e=new d;this.scene1=new g,this.scene2=new g,this.camera=e.oCamera,this.renderer=e.renderer;const r=new b(e.size.width*Math.min(2,window.devicePixelRatio)/4,e.size.height*Math.min(2,window.devicePixelRatio)/4);r.texture.type=H,r.texture.minFilter=T,r.texture.magFilter=T,this.textures=[r,r.clone()];const n=new y(2,2),m=new f({vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:ne,uniforms:{tDiffuse:{value:null}},glslVersion:z});this.mesh1=new x(n,m),this.scene1.add(this.mesh1);const v=new f({vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:se,uniforms:{img:{value:null},horizontal:{value:!1},steps:{value:1}},glslVersion:z});this.mesh2=new x(n,v),this.scene2.add(this.mesh2)}render(e,r){this.renderer.setRenderTarget(this.textures[0]),this.mesh1.material.uniforms.tDiffuse.value=r,this.renderer.render(this.scene1,this.camera);for(let n=0;n<8;n++){const m=n%2;this.renderer.setRenderTarget(this.textures[1-m]),this.mesh2.material.uniforms.img.value=this.textures[m].texture,this.mesh2.material.uniforms.horizontal.value=m===1,this.renderer.render(this.scene2,this.camera)}this.renderer.setRenderTarget(e),this.mesh1.material.uniforms.tDiffuse.value=this.textures[0].texture,this.renderer.render(this.scene1,this.camera)}}class ae{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mrt");t(this,"target1");t(this,"target2");t(this,"target3");t(this,"view");t(this,"gray");t(this,"edge1");t(this,"edge2");t(this,"merge");t(this,"fxaa");t(this,"gauss");t(this,"sample");t(this,"cone");t(this,"box");t(this,"debug");const e=new d;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.mrt=new V(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio),2),this.target1=new b(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio)),this.target2=new b(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio)),this.target3=new b(e.size.width*Math.min(2,window.devicePixelRatio),e.size.height*Math.min(2,window.devicePixelRatio)),this.debug=e.debug,this.setUp()}setUp(){this.cone=new Y,this.box=new J,this.view=new Z,this.gray=new Q,this.edge1=new P(new G(0,0,1)),this.edge2=new P(new G(1,0,0)),this.merge=new re,this.fxaa=new ie,this.gauss=new oe}update(){this.renderer.clear(),this.renderer.setRenderTarget(this.mrt),this.box.update(),this.cone.update(),this.box.on(),this.cone.off(),this.renderer.render(this.scene,this.camera),this.gray.render(this.target1,this.mrt.texture[0]),this.edge1.render(this.target2,this.target1.texture),this.merge.render(this.target1,this.mrt.texture[1],this.target2.texture),this.fxaa.render(this.target3,this.target1.texture),this.renderer.clear(),this.renderer.setRenderTarget(this.mrt),this.box.off(),this.cone.on(),this.renderer.render(this.scene,this.camera),this.gray.render(this.target1,this.mrt.texture[0]),this.edge2.render(this.target2,this.target1.texture),this.merge.render(this.target1,this.mrt.texture[1],this.target2.texture),this.fxaa.render(this.target2,this.target1.texture),this.merge.render(this.target1,this.target2.texture,this.target3.texture),this.view.render(this.target1.texture),this.gauss.render(this.target2,this.target1.texture),this.merge.render(this.target3,this.target1.texture,this.target2.texture),this.view.render(this.target3.texture)}resize(e,r){console.log(e,r)}}let U;class d{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"debug");if(U)return U;!e||(U=this,this.init(e))}init(e){this.debug=new N,this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new g,this.camera=new W(45,this.size.width/this.size.height,.1,30),this.camera.position.set(0,0,3),this.oCamera=new I(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new L({canvas:e,antialias:!0}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.toneMapping=X,this.renderer.toneMappingExposure=2,this.renderer.outputEncoding=k,this.world=new ae,new O(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){this.size={width:window.innerWidth,height:window.innerHeight},this.camera.aspect=this.size.width/this.size.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.size.width,this.size.height),this.world.resize(this.size.width,this.size.height)}}const ue=document.querySelector(".webgl"),he=new d(ue);window.addEventListener("resize",()=>{he.resize()});
