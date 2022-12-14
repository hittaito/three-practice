#include <packing>

uniform vec3 uLight;
uniform sampler2D uEnvMap; // depth
uniform sampler2D uHeightMap;
uniform float uTime;
uniform float cameraNear;
uniform float cameraFar;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out vec3 vOld;
out vec3 vNew;
out float vWaterDepth;
out float vDepth;

float readZ(vec2 uv) {
  float fragCoordZ = texture(uEnvMap, uv).x;
  float viewZ = orthographicDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

// https://github.com/martinRenou/threejs-caustics/blob/master/shaders/caustics/water_vertex.glsl
void main() {
  vec3 pos = (modelMatrix * vec4(position, 1.)).xyz; // x,-z
 
  ivec2 st = ivec2(uv * vec2(textureSize(uHeightMap, 0))) ;
  float h = texelFetch(uHeightMap, st, 0).r;
  vec4 aa = texelFetch(uHeightMap, st, 0);

  float diff = .08;
  vec3 dx = vec3(diff,texelFetch(uHeightMap, st+ivec2(-1,0), 0).r-texelFetch(uHeightMap, st+ivec2(1,0), 0).r, 0);
  vec3 dz = vec3(0.  ,texelFetch(uHeightMap, st+ivec2(0,-1), 0).r-texelFetch(uHeightMap, st+ivec2(0,1), 0).r, diff);
  vec3 n = normalize(cross(-dx,dz));
  // n = normalize(vec3(n.x, sqrt(1.0 - dot(n.xz, n.xz)), n.z)).xzy;

  pos.y += h;

  vOld = (projectionMatrix * viewMatrix * vec4(pos, 1.)).xyz;

  // direction
  vec3 refractedDir = refract(normalize(vec3(0., - .8, 0.1)), n, 0.79);
  vec4 projectedRefractedDir = projectionMatrix * viewMatrix * vec4(refractedDir, 1.);

  // init position
  vec4 projectedWaterPosition = projectionMatrix * viewMatrix * vec4(pos, 1.0); 
  vec3 current = projectedWaterPosition.xyz;
  vec2 cood = current.xy * .5 +.5;
  float depth = current.z + 2.5; // offset

  float readDepth = readZ(cood); // 0 - 1
  float x = 0.;
  for (int i=0;i<50;i++) {
    cood += projectedRefractedDir.xz * 0.005;
    depth -= projectedRefractedDir.y * .1;
    if (depth <= readDepth) {
      break;
    }
    readDepth = readZ(cood);
    x = float(i);
  }

  vNew =  vec3(cood.x, readDepth, cood.y);//environment.xyz;
  vec4 projectedEndPositon = projectionMatrix * viewMatrix * vec4(vNew, 1.);

  vWaterDepth = projectedWaterPosition.z/projectedWaterPosition.w * .5 + .5;
  vDepth = projectedEndPositon.z/projectedRefractedDir.w * .5 + .5;

  vUv = uv;
  vNormal = n;
  vPosition = projectedRefractedDir.xyz;//vec3(current);//texture(uEnvMap, cood).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos,1.);//modelMatrix * vec4(position, 1.0);
}