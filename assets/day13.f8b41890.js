var y=Object.defineProperty;var z=(r,e,n)=>e in r?y(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var t=(r,e,n)=>(z(r,typeof e!="symbol"?e+"":e,n),n);import{a2 as b,l as u,a3 as D,e as h,G as c,D as C,M as l,d as v,V as G,t as S,S as x,c as m,F as U,N as p,u as P,i as M,j as T,P as R,O as F,W as k,s as V}from"./three.module.9352233f.js";import{O as _}from"./OrbitControls.e80330a0.js";import"./stats.min.46d05fb3.js";import{F as A}from"./FXAAShader.0b4b74a1.js";class H{constructor(){t(this,"ui");t(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class W extends b{constructor(e=10){super(),this.scale=e}getPoint(e,n=new u){const i=n;e*=Math.PI*2;const s=(2+Math.cos(3*e))*Math.cos(2*e),o=(2+Math.cos(3*e))*Math.sin(2*e),d=Math.sin(3*e);return i.set(s,o,d).multiplyScalar(this.scale)}}var E=`uniform sampler2D uInner;
uniform vec3 uCameraPos;
uniform float uNear;
uniform float uFar;

in vec3 vWorldPos;
in vec2 vUv;

#include <packing>

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oDepth;

void main(void) {
    vec2 uv = vUv.yx;
    uv.y *= 3.;
    uv.y = fract(  uv.y);
    vec3 col = texture(uInner, uv).xyz;
    uv.x *= 8.;
    vec2 grid = fract(uv * 10.);
    vec2 gid = floor(uv *10.);
    oColor = vec4(col, 1.);

    float dist = length(vWorldPos - uCameraPos);
    dist = (dist - uNear) / (uFar - uNear);
    oDepth = packDepthToRGBA( dist );
}`,L=`out vec2 vUv;
out vec3 vWorldPos;

void main() {
  vUv = uv;
  vWorldPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;const w=1500;class B{constructor(){t(this,"scene");t(this,"camera");t(this,"mesh");t(this,"vec");t(this,"curve");const e=new a;this.scene=e.scene,this.camera=e.camera;const n=new W;this.curve=n;const i=new D(this.curve,256,8,32),s=new h({glslVersion:c,fragmentShader:E,vertexShader:L,uniforms:{uInner:{value:null},uCameraPos:{value:null},uNear:{value:0},uFar:{value:0}},side:C});this.mesh=new l(i,s),this.scene.add(this.mesh),this.vec={position:new u(0,0,0),tangent:new u(0,0,0),binormal:new u(0,0,0),normal:new u(0,0,0),target:new u(0,0,0)}}setInner(e){this.mesh.material.uniforms.uInner.value=e}updateCamera(e){const n=e%w/w;this.curve.getPointAt(n,this.vec.position);const i=this.mesh.geometry,s=n*i.tangents.length,o=Math.floor(s),d=(o+1)%i.tangents.length;this.vec.binormal.subVectors(i.binormals[d],i.binormals[o]),this.vec.binormal.multiplyScalar(s-o).add(i.binormals[o]),i.parameters.path.getTangentAt(n,this.vec.tangent),this.vec.normal.copy(this.vec.binormal).cross(this.vec.tangent),this.vec.position.add(this.vec.normal.clone().multiplyScalar(-4)),this.camera.position.copy(this.vec.position),i.parameters.path.getPointAt((n+30/i.parameters.path.getLength())%1,this.vec.tangent),this.vec.target.copy(this.vec.position).add(this.vec.tangent),this.camera.matrix.lookAt(this.vec.position,this.vec.tangent,this.vec.normal),this.camera.quaternion.setFromRotationMatrix(this.camera.matrix),this.mesh.material.uniforms.uCameraPos.value=this.camera.position,this.mesh.material.uniforms.uNear.value=this.camera.near,this.mesh.material.uniforms.uFar.value=this.camera.far}}var g=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,I=`#define CH r

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec3 uColor;
varying vec2 vUv;

out vec4 outColor;

void main() {

    vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

    const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); 
    const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); 

    float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).CH;
    float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).CH;
    float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).CH;

    float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).CH;
    float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).CH;
    float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).CH;

    float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).CH;
    float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).CH;
    float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).CH;

    float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
        Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
        Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

    float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
        Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
        Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );
    G = step(0.02,G);

    outColor = vec4( vec3( G ) * vec3(192.,48., 192.) / 255. * .4, 1 );

}`;class j{constructor(){t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.camera=e.oCamera,this.renderer=e.renderer;const n=new v(2,2),i=new h({uniforms:{tDiffuse:{value:null},opacity:{value:1},resolution:{value:new G},uColor:{value:new S(65280)}},vertexShader:g,fragmentShader:I,glslVersion:c});this.mesh=new l(n,i),this.mesh.material.uniforms.resolution.value.x=e.size.width,this.mesh.material.uniforms.resolution.value.y=e.size.height,e.resizeFn.push(this.resize.bind(this))}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.mesh,this.camera),this.renderer.setRenderTarget(null)}resize(e,n){this.mesh.material.uniforms.resolution.value.x=e,this.mesh.material.uniforms.resolution.value.y=n}}class N{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new x,this.camera=e.oCamera,this.renderer=e.renderer;const n=new v(2,2),i=new h({...A});this.mesh=new l(n,i),this.mesh.material.uniforms.resolution.value.x=1/(window.innerWidth*this.renderer.getPixelRatio()),this.mesh.material.uniforms.resolution.value.y=1/(window.innerHeight*this.renderer.getPixelRatio()),this.scene.add(this.mesh)}render(e,n){this.renderer.setRenderTarget(e),this.mesh.material.uniforms.tDiffuse.value=n,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var O=`uniform sampler2D tDiffuse;

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
}`,q=`precision highp float;

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
}`;class ${constructor(){t(this,"camera");t(this,"renderer");t(this,"textures");t(this,"mesh1");t(this,"mesh2");const e=new a;this.camera=e.oCamera,this.renderer=e.renderer;const n=new m(e.size.width/4,e.size.height/4);n.texture.type=U,n.texture.minFilter=p,n.texture.magFilter=p,this.textures=[n,n.clone()];const i=new v(2,2),s=new h({vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:O,uniforms:{tDiffuse:{value:null}},glslVersion:c});this.mesh1=new l(i,s);const o=new h({vertexShader:`
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,fragmentShader:q,uniforms:{img:{value:null},horizontal:{value:!1},steps:{value:1}},glslVersion:c});this.mesh2=new l(i,o),e.resizeFn.push(this.resize.bind(this))}render(e,n){this.renderer.setRenderTarget(this.textures[0]),this.mesh1.material.uniforms.tDiffuse.value=n,this.renderer.render(this.mesh1,this.camera);for(let i=0;i<4;i++){const s=i%2;this.renderer.setRenderTarget(this.textures[1-s]),this.mesh2.material.uniforms.img.value=this.textures[s].texture,this.mesh2.material.uniforms.horizontal.value=s===1,this.renderer.render(this.mesh2,this.camera)}this.renderer.setRenderTarget(e),this.mesh1.material.uniforms.tDiffuse.value=this.textures[0].texture,this.renderer.render(this.mesh1,this.camera)}resize(e,n){this.textures.forEach(i=>{i.setSize(e/4,n/4)})}}var X=`uniform float uTime;

in vec2 vUv;

layout(location = 0) out vec4 oColor;

float random(vec2 uv) {
    return fract(sin(uv.x* 2134.+uv.y*732. + 4928. ) * 3202. );
}
float map(float x, float b1, float b2, float a1, float a2) {
  float p = (x-b1)/(b2-b1);
  return p * a2 + (1. - p) * a1;
}

void main(void) {
  vec2 uv = vUv;
  uv *= 20.;
  float time = uTime * .007;
  vec3 col = vec3(0);
  vec2 id = floor(uv);
  float rnd = random(id.xx);
  uv.y += rnd + 15. * (sin(rnd * 10. + time) * .5 + .5) ;
  float y = sin(uv.y * 5.3) * sin(uv.y * 2.9 + 12.) * .5 +.5;
  col.y = step(.8, y);

  float thickness = .02;
  float center = map(sin(time), -1., 1., .1, .6) ;
  col += vec3(192.,48., 192.) / 255. * smoothstep(center - thickness, center, y) * smoothstep(center + thickness, center, y);

  oColor = vec4(col, 1.);
}`;class K{constructor(){t(this,"scene");t(this,"renderer");t(this,"camera");t(this,"target");t(this,"mesh");const e=new a;this.scene=e.scene,this.camera=e.oCamera,this.renderer=e.renderer;const n=e.size,i=new v(2,2),s=new h({vertexShader:g,fragmentShader:X,uniforms:{uTime:{value:0}},glslVersion:c});this.mesh=new l(i,s),this.target=new m(n.width,n.height)}render(e){this.mesh.material.uniforms.uTime.value=e,this.renderer.setRenderTarget(this.target),this.renderer.render(this.mesh,this.camera),this.renderer.setRenderTarget(null)}}var J=`uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform sampler2D uBokeh;
uniform sampler2D uEdge;

in vec2 vUv;

out vec4 outColor;

#include <packing>

float map(float x, float b1, float b2, float a1, float a2) {
  float p = (x-b1)/(b2-b1);
  return p * a2 + (1. - p) * a1;
}

void main() {
  vec3 col = texture(uColor, vUv).xyz;

  float depth = unpackRGBAToDepth(texture(uDepth, vUv));
  depth = 1. - depth;
  depth = depth * depth;
  depth = clamp(map(depth, 0., .6, 0., 1.), 0., 1.);
  
  
  
  
  
  
  
  
  
  
  vec3 edge = texture(uEdge, vUv).xyz;

  vec3 bokeh = texture(uBokeh, vUv).xyz;
  col = mix(bokeh, col, depth);
  col += edge * 1.5;

  outColor = vec4(col, 1.);
}`;class Q{constructor(){t(this,"scene");t(this,"renderer");t(this,"camera");t(this,"mesh");const e=new a;this.scene=e.scene,this.renderer=e.renderer,this.camera=e.oCamera;const n=new v(2,2),i=new h({glslVersion:c,vertexShader:g,fragmentShader:J,uniforms:{uColor:{value:null},uDepth:{value:null},uBokeh:{value:null},uEdge:{value:null}}});this.mesh=new l(n,i)}render(e){this.mesh.material.uniforms.uColor.value=e.color,this.mesh.material.uniforms.uDepth.value=e.depth,this.mesh.material.uniforms.uBokeh.value=e.bokeh,this.mesh.material.uniforms.uEdge.value=e.edge,this.renderer.setRenderTarget(null),this.renderer.render(this.mesh,this.camera)}}class Y{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"mesh");const e=new a;this.scene=new x,this.camera=e.oCamera,this.renderer=e.renderer;const n=new v(2,2),i=new h({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
			#include <packing>

			varying vec2 vUv;
			uniform sampler2D tDepth;

			void main() {
				float depth = unpackRGBAToDepth( texture2D( tDepth, vUv ) );
                if(depth > 0.6){
                    depth = 2.5 * (1.0 - depth);
                }else if(depth >= 0.4){
                    depth = 1.0;
                }else{
                    depth *= 2.5;
                }
                depth = depth * depth * depth;
				gl_FragColor.rgb =  vec3( depth ) ;
				gl_FragColor.a = 1.0;
			}`,uniforms:{tDiffuse:{value:null},tDepth:{value:null}}});this.mesh=new l(n,i),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDepth.value=e,this.renderer.render(this.scene,this.camera)}}class Z{constructor(){t(this,"scene");t(this,"camera");t(this,"renderer");t(this,"targets");t(this,"target",[]);t(this,"tube");t(this,"inner");t(this,"fxaa");t(this,"gauss");t(this,"edge");t(this,"mix");t(this,"viewer");const e=new a;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.targets=new P(e.size.width,e.size.height,2),this.target.push(new m(e.size.width,e.size.height)),this.target.push(new m(e.size.width,e.size.height)),this.setUp(),e.resizeFn.push(this.resize.bind(this))}setUp(){const e=new M(16777215,.3);this.scene.add(e);const n=new T(2245870,1);this.scene.add(n),this.tube=new B,this.inner=new K,this.fxaa=new N,this.gauss=new $,this.edge=new j,this.mix=new Q,this.viewer=new Y}update(e){this.inner.render(e),this.tube.setInner(this.inner.target.texture),this.tube.updateCamera(e),this.renderer.setRenderTarget(this.targets),this.renderer.render(this.scene,this.camera),this.edge.render(this.target[0],this.targets.texture[0]),this.gauss.render(this.target[1],this.target[0].texture),this.gauss.render(this.target[0],this.targets.texture[0]),this.mix.render({color:this.targets.texture[0],depth:this.targets.texture[1],bokeh:this.target[0].texture,edge:this.target[1].texture})}resize(e,n){this.targets.setSize(e,n),this.target.forEach(i=>{i.setSize(e,n)})}}let f;class a{constructor(e){t(this,"scene");t(this,"camera");t(this,"oCamera");t(this,"renderer");t(this,"world");t(this,"size");t(this,"resizeFn",[]);t(this,"debug");if(f)return f;!e||(f=this,this.init(e))}init(e){this.debug=new H,this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.scene=new x,this.camera=new R(45,this.size.width/this.size.height,.1,80),this.camera.position.set(0,0,3),this.oCamera=new F(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new k({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=V,this.world=new Z,new _(this.camera,e),this.render(0)}render(e){this.debug.begin(),this.world.update(e),this.debug.end(),requestAnimationFrame(()=>this.render(e+1))}resize(){this.size={width:window.innerWidth*Math.min(2,window.devicePixelRatio),height:window.innerHeight*Math.min(2,window.devicePixelRatio)},this.camera.aspect=this.size.width/this.size.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.resizeFn.forEach(e=>e(this.size.width,this.size.height))}}const ee=document.querySelector(".webgl"),te=new a(ee);window.addEventListener("resize",()=>{te.resize()});
