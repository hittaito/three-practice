uniform float uTime;
uniform float uSeparate;
uniform float uAlign;
uniform float uCohens;
uniform float uForce;

uniform sampler2D uPosition;
uniform sampler2D uVelocity;

in vec2 vUv;

layout(location = 0) out vec4 oPosition;
layout(location = 1) out vec4 oVelocity;

#define PI acos(-1.)

void main(void) {
  float radius = uSeparate + uAlign + uCohens;
  float threshold1 = uSeparate / radius;
  float threshold2 = (uSeparate+uAlign) / radius;
  float radius2 = radius*radius;

  ivec2 size = textureSize(uPosition, 0);
  ivec2 uv = ivec2(vUv*vec2(textureSize(uPosition, 0)));
  vec3 pos = texelFetch(uPosition, uv, 0).xyz;
  vec3 vel = texelFetch(uVelocity, uv, 0).xyz;

  vel = mix(vel, -normalize(pos), smoothstep(19., 20., length(pos)));

  vec3 cohesion, separation, align;
  float nCohesion, nSeparation, nAlign;
  for (int x = 0; x < size.x;x++) {
    for(int y = 0; y < size.y;y++) {
      vec3 otherPos = texelFetch(uPosition, ivec2(x,y), 0).xyz;
      vec3 dir = otherPos - pos;
      float dist = length(dir);

      if (dist < 0.0001 || dist > radius) continue;

      cohesion += otherPos;
      nCohesion++;

      if (dist < uSeparate) {
        separation -= dir;
      }

      vec3 otherVel = texelFetch(uVelocity, ivec2(x,y), 0).xyz;
      align += otherVel;
      nAlign++;
      // float dist2 = dist *dist;
      // float rate = dist2 / radius2;

      // if (rate < threshold1) { //離れる動き
      //   vel -= normalize(otherPos - pos) * (threshold1/rate- 1.) * uForce;

      // } else if (rate < threshold2) { //整列する動き
      //   float thresholdDelta = threshold2 -threshold1;
      //   float adjust = (rate - threshold1) / thresholdDelta;
      //   vec3 otherVel = texelFetch(uVelocity, ivec2(x,y), 0).xyz;
      //   float force = (1. - cos(adjust * 2. * PI) *.5);
      //   vel += normalize(otherVel) * force;
      // } else {
      //   float delta = 1. - threshold2;
      //   float adjustPer;
      //   if (delta == 0.) adjustPer = 1.;
      //   else adjustPer = (rate - threshold2) /delta;
      //   float force = (1. + cos(adjustPer * 2. * PI)) * uForce;
      //   vel += normalize(otherPos - pos) * force;
      // }
    }
  }
  if (nCohesion > 0.) {
    cohesion/= nCohesion;
    
  }vec3 cohesDir = cohesion - pos;

  if (nAlign > 0.) {
    align /= nAlign;
  }


  vel += cohesDir *.1 + separation  *.1 + align * .1;

  if ( length( vel ) > 1.5 ) {
      vel = normalize( vel ) * 1.5 ;
  }
  pos += vel * .1;

  oPosition = vec4(pos, 1.);
  oVelocity = vec4(vel,1.);
}