uniform sampler2D uMap;
uniform float uRow;
uniform float uColumn;

in float iId;

out vec2 vUv;
out float vId;
out vec3 vCol;

void main() {
  vUv = uv;
  vId = iId;
  vec3 pos = position;

  float col = uColumn;
  float row = uRow;

  vec2 xy = vec2(
    mod(iId, col),
    floor(iId/col)
  ) / vec2(col, row);
  float h = texture(uMap, xy).x;
  vCol = vec3(.3, .7, 0.);
  vec3 p = vec3(xy , 0.) - vec3(.5, .5, 0.);
  pos *= (1.-h) * 5.;
  pos += p * 30.;
  pos.z+=h *3.3;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
}