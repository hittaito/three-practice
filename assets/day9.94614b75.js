var P=Object.defineProperty;var C=(i,e,t)=>e in i?P(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var n=(i,e,t)=>(C(i,typeof e!="symbol"?e+"":e,t),t);import{S as m,d as u,e as d,G as h,M as x,z as S,D as F,ah as V,ai as U,u as z,F as g,P as D,O as T,W as A,s as M}from"./three.module.9352233f.js";import{O as R}from"./OrbitControls.e80330a0.js";import"./stats.min.46d05fb3.js";class j{constructor(){n(this,"ui");n(this,"stats")}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}var w=`out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,I=`in vec2 vUv;

layout (location = 0) out vec4 oPosition;
layout (location = 1) out vec4 oVelocity;
layout (location = 2) out vec4 oUpper;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    float r1 = fbm(vec2(gl_FragCoord.y, 0.)) - .5;
    float r2 = fbm(vec2(gl_FragCoord.y, 234.)) - .5;
    float r3 = fbm(vec2(gl_FragCoord.y, 94872.238)) - .5;
    float r4 = fbm(vec2(gl_FragCoord.y, 23.)) - .5;
    float r5 = fbm(vec2(gl_FragCoord.y, 472.)) - .5;
    float r6 = fbm(vec2(gl_FragCoord.y, 23019.))  - .5;
    vec3 v = normalize(vec3(r4,r5,r6));
    vec3 right = cross(v, vec3(0.,0., 1.));

    oPosition = vec4(r1,r2,r3,1.);
    oVelocity = vec4(v,1.);
    oUpper = vec4(normalize(cross(right, v)), 0.);
}`;class L{constructor(e,t){n(this,"scene");n(this,"camera");n(this,"mesh");n(this,"renderer");n(this,"param");const r=new a;this.scene=new m,this.camera=r.oCamera,this.renderer=r.renderer,this.param={length:e,num:t};const o=new u(2,2),s=new d({vertexShader:w,fragmentShader:I,glslVersion:h});this.mesh=new x(o,s),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(e),this.renderer.setSize(this.param.length,this.param.num),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}}var k=`uniform sampler2D u_position;
uniform sampler2D u_velocity;
uniform sampler2D u_upper;

in float i_trail;

out vec3 v_color;

mat4 lookAt(vec3 eye, vec3 center, vec3 up) {
  vec3 z = normalize(eye - center);
  vec3 x = normalize(cross(up, z));
  vec3 y = cross(z, x);

  return mat4(x.x, y.x, z.x, 0.0, x.y, y.y, z.y, 0.0, x.z, y.z, z.z, 0.0,
              -(eye.x * x.x + eye.y * x.y + eye.z * x.z),
              -(eye.x * y.x + eye.y * y.y + eye.z * y.z),
              -(eye.x * z.x + eye.y * z.y + eye.z * z.z), 1.);
}

void main() {
  vec3 cPos = texelFetch(u_position, ivec2(0, 0), 0).xyz;
  vec3 cVel = texelFetch(u_velocity, ivec2(0, 0), 0).xyz;
  vec3 cUp = texelFetch(u_upper, ivec2(0, 0), 0).xyz;
  cVel = normalize(cVel);
  mat4 cLook = lookAt(cPos - cVel * .2 + cUp * .01, cPos, cUp);

  vec3 tPos = texelFetch(u_position, ivec2(int(i_trail), gl_InstanceID), 0).xyz;
  vec3 tVel = texelFetch(u_velocity, ivec2(int(i_trail), gl_InstanceID), 0).xyz;
  vec3 tUp = texelFetch(u_upper, ivec2(int(i_trail), gl_InstanceID), 0).xyz;

  mat4 look = lookAt(vec3(0.), normalize(tVel), tUp);
  mat4 modelMat = mat4(1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., tPos.x,
                       tPos.y, tPos.z, 1.) *
                  look;

  v_color = vec3(i_trail / 5., 0., 0.); 
  gl_Position = projectionMatrix * cLook * modelMat * vec4(position, 1.);
}`,q=`in vec3 v_color;

out vec4 oColor;

void main(void) {
    oColor = vec4(v_color, .3);
}`;class E{constructor(e,t){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");const r=new a;this.scene=r.scene,this.camera=r.camera,this.renderer=r.renderer;const o=new u(e-1,.01,e-1,1),s=o.getAttribute("position").clone(),y=2*e,f=new Float32Array(y);for(let c=0;c<y;c++){const b=s.getX(c);f[c]=b+(e-1)*.5,s.setX(c,0)}o.setAttribute("i_trail",new S(f,1)),o.setAttribute("position",s);const _=new d({vertexShader:k,fragmentShader:q,uniforms:{u_position:{value:null},u_velocity:{value:null},u_upper:{value:null}},wireframe:!1,glslVersion:h,side:F,blending:V,depthTest:!0});this.mesh=new U(o,_,t),this.scene.add(this.mesh)}setPosTexture(e){this.mesh.material.uniforms.u_position.value=e.texture[0],this.mesh.material.uniforms.u_velocity.value=e.texture[1],this.mesh.material.uniforms.u_upper.value=e.texture[2]}update(){this.renderer.render(this.scene,this.camera)}}var G=`uniform sampler2D u_position;
uniform sampler2D u_velocity;
uniform sampler2D u_upper;
uniform float u_time;

in vec2 vUv;

layout (location = 0) out vec4 oPosition;
layout (location = 1) out vec4 oVelocity;
layout (location = 2) out vec4 oUpper;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

#define OCTAVES 6
float fbm (in vec4 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}
vec3 cnoise(vec3 p, float t) {
    vec2 e = vec2(0.001, 0.);

    vec4 ox = vec4(2345.234, 6452.464, 23883.34, 4572.3456);
    vec4 oy = vec4(93478.234, 38490.234,298.9367, 2346.685);
    vec4 oz = vec4(53482.294767,2364.234,642.25, 92345.24);

    return vec3(
        snoise(vec4(p+e.yxy, t) + oz) - snoise(vec4(p-e.yxy, t) + oz) - (snoise(vec4(p+e.yyx, t) +oy ) - snoise(vec4(p-e.yyx, t)+oy)),
        snoise(vec4(p+e.yyx, t) + ox) - snoise(vec4(p-e.yyx, t) + ox) - (snoise(vec4(p+e.xyy, t) +oz ) - snoise(vec4(p-e.xyy, t)+oz)),
        snoise(vec4(p+e.xyy, t) + oy) - snoise(vec4(p-e.xyy, t) + oy) - (snoise(vec4(p+e.yxy, t) +ox ) - snoise(vec4(p-e.yxy, t)+ox))
    ) / (2.* e.x);
}
vec3 limit(vec3 vel) {
    if (length(vel) > 1.) {
        return normalize(vel);
    } else {
        return vel;
    }
}

void main() {
    ivec2 coord = ivec2(gl_FragCoord.xy);

    if (coord.x == 0) {
        vec3 position = texelFetch(u_position, coord, 0).xyz;
        vec3 velocity = texelFetch(u_velocity, coord, 0).xyz;
        vec3 upper = texelFetch(u_upper, coord, 0).xyz;

        vec3 acc = cnoise(position * 1.5, u_time) ;
        acc = acc / max(1., length(acc));
        
        velocity = limit(velocity);
        vec3 invertVel = - normalize(position) * 2.;
        velocity = mix(velocity, invertVel, smoothstep(1., 2., length(position)));
        position += velocity * .004;

        vec3 front = normalize(velocity);
        vec3 right = cross(front, upper);
        upper = normalize(cross(right, front));

        oPosition = vec4(position, 1.);
        oVelocity = vec4(velocity, 0.);
        oUpper = vec4(upper, 0.);
    } else {
        vec3 position = texelFetch(u_position, coord - ivec2(1,0), 0).xyz;
        vec3 velocity = texelFetch(u_velocity, coord - ivec2(1,0), 0).xyz;
        vec3 upper = texelFetch(u_upper, coord - ivec2(1,0), 0).xyz;

        oPosition = vec4(position, 1.);
        oVelocity = vec4(velocity, 0.);
        oUpper = vec4(upper, 0.);
    }
}`;class O{constructor(e,t){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");n(this,"time",0);n(this,"param");const r=new a;this.scene=new m,this.camera=r.oCamera,this.renderer=r.renderer,this.param={length:e,num:t};const o=new u(2,2),s=new d({vertexShader:w,fragmentShader:G,glslVersion:h,uniforms:{u_position:{value:null},u_velocity:{value:null},u_upper:{value:null},u_time:{value:0}}});this.mesh=new x(o,s),this.scene.add(this.mesh)}update(e,t){this.time++,this.renderer.setRenderTarget(e),this.renderer.setSize(this.param.length,this.param.num),this.mesh.material.uniforms.u_position.value=t.texture[0],this.mesh.material.uniforms.u_velocity.value=t.texture[1],this.mesh.material.uniforms.u_upper.value=t.texture[2],this.mesh.material.uniforms.u_time.value=this.time,this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.renderer.setSize(innerWidth*this.renderer.getPixelRatio(),innerHeight*this.renderer.getPixelRatio())}}class W{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mesh");const e=new a;this.scene=new m,this.camera=e.oCamera,this.renderer=e.renderer;const t=new u(2,2),r=new d({vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,fragmentShader:`
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(tDiffuse, vUv);
            }`,uniforms:{tDiffuse:{value:null}}});this.mesh=new x(t,r),this.scene.add(this.mesh)}render(e){this.renderer.setRenderTarget(null),this.mesh.material.uniforms.tDiffuse.value=e,this.renderer.render(this.scene,this.camera)}}const l=300,v=100;class X{constructor(){n(this,"scene");n(this,"camera");n(this,"renderer");n(this,"mrts");n(this,"initPlane");n(this,"updatePlane");n(this,"renderPlane");n(this,"sample");n(this,"view");n(this,"step",0);const e=new a;this.scene=e.scene,this.camera=e.camera,this.renderer=e.renderer,this.setUp()}setUp(){this.mrts=[new z(l,v,3,{type:g}),new z(l,v,3,{type:g})],this.initPlane=new L(l,v),this.updatePlane=new O(l,v),this.renderPlane=new E(l,v),this.view=new W,this.initPlane.render(this.mrts[0]),this.initPlane.render(this.mrts[1])}update(){const e=this.step%2;this.renderer.clear(),this.updatePlane.update(this.mrts[1-e],this.mrts[e]),this.renderPlane.setPosTexture(this.mrts[1-e]),this.renderer.render(this.scene,this.camera),this.step++}resize(){}}let p;class a{constructor(e){n(this,"scene");n(this,"camera");n(this,"oCamera");n(this,"renderer");n(this,"world");n(this,"size");n(this,"debug");if(p)return p;!e||(p=this,this.init(e))}init(e){this.debug=new j,this.size={width:window.innerWidth,height:window.innerHeight},this.scene=new m,this.camera=new D(45,this.size.width/this.size.height,1e-4,100),this.camera.position.set(0,0,3),this.oCamera=new T(-1,1,1,-1,1,10),this.oCamera.position.set(0,0,10),this.oCamera.lookAt(0,0,0),this.renderer=new A({canvas:e}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputEncoding=M,this.world=new X,new R(this.camera,e),this.render()}render(){this.debug.begin(),this.world.update(),this.debug.end(),requestAnimationFrame(()=>this.render())}resize(){}}const Y=document.querySelector(".webgl"),Z=new a(Y);window.addEventListener("resize",()=>{Z.resize()});
