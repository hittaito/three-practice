uniform float uTime;

out vec2 vUv;

// https://qiita.com/aa_debdeb/items/c34a3088b2d8d3731813
// https://neort.io/art/bqtdqo43p9f48fkit640?index=153&origin=tag
vec4 rotQ(vec3 axis, float rad) {
  vec3 n = normalize(axis);
  float h = rad * .5;
  float s = sin(h);
  return vec4(n * s, cos(h));
}
// 共役conjugate
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

// https://glmatrix.net/docs/mat4.js.html#line1619
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
  vec3 cameraPos = vec3(3. * sin(uTime * .01), 3., 3. * cos(uTime * .01));
  vec3 cameraUp = vec3(0., 1., 0.);

  vec3 axis = vec3(2., 1., 3.);
  float rad = uTime * .01;
  vec4 q = rotQ(axis, rad);
  cameraPos = appQ(cameraPos, q);
  cameraUp = appQ(cameraUp, q);

  // mat4 vMat = lookAt(vec3(0., 0., 3.), vec3(0.), vec3(0., 1., 0.));
  mat4 vMat = lookAt(cameraPos, vec3(0.), cameraUp);

  vUv = uv;
  gl_Position = projectionMatrix * vMat * modelMatrix * vec4(position, 1.0);
}