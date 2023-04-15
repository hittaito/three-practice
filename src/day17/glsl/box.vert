#define PI acos(-1.)

uniform float uSide;
uniform sampler2D uTexture;

// in float iId;
in vec3 iParam;

out vec2 vUv;
out vec3 vXYZ;
out float vDist1;
out float vDist2;
out float vDist3;

mat2 rot(float a) {
  float s,c;
  s = sin(a);
  c = cos(a);
  return mat2(c,-s,s,c);
}

vec4 rotQ(vec3 axis, float rad) {
  vec3 n = normalize(axis);
  float h = rad * .5;
  float s = sin(h);
  return vec4(n * s, cos(h));
}
vec4 conQ(vec4 q) { return vec4(-q.xyz, q.w); }
vec4 mulQ(vec4 q1, vec4 q2) {
  return vec4(q2.w * q1.x - q2.z * q1.y + q2.y * q1.z + q2.x * q1.w,
              q2.z * q1.x + q2.w * q1.y - q2.x * q1.z + q2.y * q1.w,
              -q2.y * q1.x + q2.x * q1.y + q2.w * q1.z + q2.z * q1.w,
              -q2.x * q1.x - q2.y * q1.y - q2.z * q1.z + q2.w * q1.w);
}
vec3 appQ(vec3 v, vec4 q) {
  vec4 vq = vec4(v, 0.);
  vec4 cq = conQ(q);
  vec4 mq = mulQ(mulQ(cq, vq), q);
  return mq.xyz;
}

void main() {
  vUv = uv;
  vXYZ = iParam / uSide;
  vec4 map1 = texture(uTexture, vXYZ.xy);
  vec4 map2 = texture(uTexture, vXYZ.yz);
  vec4 map3 = texture(uTexture, vXYZ.zx);
  vec3 pos = position;


  float gap = 1.2;
  vec3 dist = (iParam - vec3(uSide * .5)) * gap;
  vec4 q1 = rotQ(normalize(map1.xyz -.5), map1.w * 2. * PI * 1.5);
  vec4 q2 = rotQ(normalize(map2.xyz -.5), map2.w * 2. * PI * 1.);
  vec4 q = mulQ(q1,q2);
  pos = appQ(pos, q); // 回転
  pos *= (1. - min(1., length((vXYZ-.5)*2.))) * 2.4; // scale
  pos += map1.xyz * 1.5;
  pos += map2.xyz * 1.9;
  pos += map3.xyz * 2.;
  pos += dist;
  vDist1 = length(dist);
  vDist2 = length(dist-vec3(0., 15., 0.));
  vDist3 = length(dist-vec3(0., 0., 15.));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1);
}