uniform sampler2D uInner;
uniform vec3 uCameraPos;
uniform float uNear;
uniform float uFar;

in vec3 vWorldPos;
in vec2 vUv;

#include <packing>

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oDepth;

void main(void) {
    vec2 uv = vUv.yx;
    uv.y *= 3.;
    uv.y = fract(  uv.y);
    vec3 col = texture(uInner, uv).xyz;
    uv.x *= 8.;
    vec2 grid = fract(uv * 10.);
    vec2 gid = floor(uv *10.);
    oColor = vec4(col, 1.);

    float dist = length(vWorldPos - uCameraPos);
    dist = (dist - uNear) / (uFar - uNear);
    oDepth = packDepthToRGBA( dist );
}