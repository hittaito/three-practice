in float id;

out vec2 vUv;
out float vId;

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

float r(float x) {
  return fract(sin(x * 34.49 + 932.23) * cos(x*238.18+48.29)) ;
}

vec3 random(float x) {
  return vec3(
    r(x) * 2. - 1.,
    r(x + 93.23) * 2. - 1.,
    r(x * 2.234 + 372.12) + 3.
  );
}

void main() {
  vec3 pos = position;
  pos += random(id) * vec3(20., 20., 10.);
  vec3 cPos = vec3(0);//cameraPosition; // hard code
  vec3 dir = normalize(cPos - pos);
  vec3 n = normalize(vec3(0., 0., 1.));
  float angle = acos(dot(n, dir));
  vec3 axis = cross(n, dir);
  vec4 q = rotQ(axis, angle);
  pos = appQ(pos, q);

  vUv = uv;
  vId = id;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}