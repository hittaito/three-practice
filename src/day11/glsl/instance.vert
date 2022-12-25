uniform sampler2D uPosition;
uniform sampler2D uVelocity;

// instanced
in vec2 id;

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
  ivec2 uv = ivec2(id);
  vec3 pos = texelFetch(uPosition, uv, 0).xyz;

  vec3 dir = normalize(texelFetch(uVelocity, uv, 0).xyz);
  vec3 top = vec3(0,1,0);
  vec3 c = cross( dir,top);
  float a =-acos(dot(dir,top));
  vec4 q = rotQ(c, a);
  vec3 newPos = appQ(position, q);


  gl_Position = projectionMatrix*modelViewMatrix*vec4(pos+newPos, 1.);
}