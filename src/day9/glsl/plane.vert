uniform sampler2D u_position;
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

  v_color = vec3(i_trail / 5., 0., 0.); // vec3(i_trail / 200., 1., 0.);
  gl_Position = projectionMatrix * cLook * modelMat * vec4(position, 1.);
}