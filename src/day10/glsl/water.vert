uniform sampler2D uHeightMap;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;


void main() {
  vec3 pos = (modelMatrix * vec4(position,1.)).xyz;

  ivec2 st = ivec2(uv * vec2(textureSize(uHeightMap, 0))) ;
  float h = texelFetch(uHeightMap, st, 0).w;

  vec3 n = normalize(vec3(
    texelFetch(uHeightMap, st+ivec2(-1,0), 0).w - texelFetch(uHeightMap, st+ivec2(1,0), 0).w,
    0.,
    texelFetch(uHeightMap, st+ivec2(0,-1), 0).w - texelFetch(uHeightMap, st+ivec2(0,1), 0).w
  ));

  pos.y += h;

  vUv = uv;
  vNormal = n;
  vPosition = pos;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}