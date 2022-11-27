
uniform sampler2D u_position;
uniform sampler2D u_velocity;
uniform sampler2D u_upper;
uniform float u_time;

in vec2 vUv;

layout (location = 0) out vec4 oPosition;
layout (location = 1) out vec4 oVelocity;
layout (location = 2) out vec4 oUpper;

//	Simplex 4D Noise
//	by Ian McEwan, Ashima Arts
//
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
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
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

        vec3 acc = cnoise(position * 1.5, u_time) ;// vec3(0.,.001, .0);
        acc = acc / max(1., length(acc));
        // velocity += acc * .01;
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
}