uniform float uTime;
uniform float uLimit;
uniform float uSeparate;
uniform float uArea;
uniform float uSepareteForce;
uniform float uCohesionForce;
uniform float uAlignForce;
uniform vec2 uPointer;
uniform float uPointerLimit;
uniform float uPointerForce;

uniform sampler2D uPosition;
uniform sampler2D uVelocity;

in vec2 vUv;

layout(location = 0) out vec4 oPosition;
layout(location = 1) out vec4 oVelocity;

#define PI acos(-1.)

void main(void) {
  float radius = uSeparate + uArea;

  ivec2 size = textureSize(uPosition, 0);
  ivec2 uv = ivec2(gl_FragCoord.xy);
  vec3 pos, vel;
  if (uv.y == 0) {
    pos = texelFetch(uPosition, uv, 0).xyz;
    vel = texelFetch(uVelocity, uv, 0).xyz;

    vel = mix(vel, -normalize(pos), smoothstep(6., 10., length(pos)));

    // pointer
    vec3 dir = vec3(uPointer, 0.) * 10. - vec3(pos.xy, 0.);
    float dist = length(dir);
    if (dist < uPointerLimit) {
      vel -= normalize(dir) * uPointerForce;
    }

    vec3 cohesion, separation, align;
    float nCohesion, nSeparation, nAlign;
    for (int x = 0; x < size.x;x++) {
      int y = 0;
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
      otherVel = mix(otherVel, -normalize(otherPos), smoothstep(10., 15., length(otherPos)));
      align += otherVel;
      nAlign++;
    }
    vec3 cohesDir = vec3(0);
    if (nCohesion > 0.) {
      cohesion/= nCohesion;
      cohesDir = cohesion - pos;
    }

    if (nAlign > 0.) {
      align /= nAlign;
    }


    vel += cohesDir * uCohesionForce + separation  * uSepareteForce + align * uAlignForce;

    if ( length( vel ) > uLimit ) {
        vel = normalize( vel ) * uLimit ;
    }
    pos += vel * .1;
  } else {
    pos = texelFetch(uPosition, uv - ivec2(0,1), 0).xyz;
    vel = texelFetch(uVelocity, uv - ivec2(0,1), 0).xyz;
  }

  oPosition = vec4(pos, 1.);
  oVelocity = vec4(vel,1.);
}