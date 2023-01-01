uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform sampler2D uBokeh;
uniform sampler2D uEdge;

in vec2 vUv;

out vec4 outColor;

#include <packing>

float map(float x, float b1, float b2, float a1, float a2) {
  float p = (x-b1)/(b2-b1);
  return p * a2 + (1. - p) * a1;
}

void main() {
  vec3 col = texture(uColor, vUv).xyz;

  float depth = unpackRGBAToDepth(texture(uDepth, vUv));
  depth = 1. - depth;
  depth = depth * depth;
  depth = clamp(map(depth, 0., .6, 0., 1.), 0., 1.);
  // // depth = depth * depth;
  // if(depth > 0.55){
  //   depth = 1./.45 * (1.0 - depth);
  // }else if(depth >= 0.45){
  //   depth = 1.0;
  // }else{
  //   float range = clamp(map(depth, 0., .45, -5., 1.), 0., 1.);
  //   depth = range * range * range;
  // }
  // depth = depth * depth;
  vec3 edge = texture(uEdge, vUv).xyz;

  vec3 bokeh = texture(uBokeh, vUv).xyz;
  col = mix(bokeh, col, depth);
  col += edge * 1.5;

  outColor = vec4(col, 1.);
}