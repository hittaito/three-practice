uniform sampler2D uMap1; // pos, vel
uniform sampler2D uMap2; // age, rnd, size
uniform vec2 uResolution;

in float iId;

out vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  vec4 map1 = texelFetch(uMap1, ivec2(gl_InstanceID, 0), 0);
  vec4 map2 = texelFetch(uMap2, ivec2(gl_InstanceID, 0), 0);
  // vUv = map1.xy;
  float r = uResolution.x/uResolution.y;
  pos += (map1.xyz+ map2.xyz + iId) * .0;
  pos *= max(0., map2.z - map2.x/1000.);
  pos.xy += (map1.xy * 2. -1.) * vec2(r,1.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}