
precision highp float;

uniform sampler2D img1;
uniform sampler2D img2;

in vec2 vUv;

layout(location = 0) out vec4 outColor1;
layout(location = 1) out vec4 outColor2;

float ApproximateEdgeDelta(vec2 grad, float a) {
    if (grad.x == 0.0 || grad.y == 0.0) {
        return 0.5 - a;
    }
    grad = abs(normalize(grad));
    float gmax = max(grad.x, grad.y);
    float gmin = min(grad.x, grad.y);

    float a1 = 0.5 * gmin / gmax;
    if (a < a1) {
        return 0.5 * (gmax + gmin) - sqrt(2.0 * gmax * gmin * a);
    }
    if (a < (1.0 - a1)) {
        return (0.5 - a) * gmax;
    }
    return -0.5 * (gmax + gmin) + sqrt(2.0 * gmax * gmin * (1.0 - a));
}

vec4 UpdateDistance(vec4 p, ivec2 pos, ivec2 o, sampler2D img) {
    vec4 neighbor = texelFetch(img, pos + o, 0);
    ivec2 ndelta = ivec2(neighbor.xy);
    vec4 closest = texelFetch(img, pos + o - ndelta, 0);

    if (closest.a == .0 || o == ndelta) {
        return p;
    }
    vec2 delta = neighbor.xy - vec2(o);
    float dist = length(delta) + ApproximateEdgeDelta(delta, closest.a);
     if (dist < p.z) {
        p.xy = delta;
        p.z = dist;
     }
    return p;
}
vec4 calc(sampler2D img) {
    ivec2 pos = ivec2(vUv * vec2(textureSize(img, 0)));
    vec4 p = texelFetch(img, pos, 0);

    if (p.z > 0.0) {
        p = UpdateDistance(p, pos, ivec2(-1,  0), img);
        p = UpdateDistance(p, pos, ivec2(-1, -1), img);
        p = UpdateDistance(p, pos, ivec2( 0, -1), img);
        p = UpdateDistance(p, pos, ivec2( 1, -1), img);
        p = UpdateDistance(p, pos, ivec2( 1,  0), img);
        p = UpdateDistance(p, pos, ivec2( 1,  1), img);
        p = UpdateDistance(p, pos, ivec2( 0,  1), img);
        p = UpdateDistance(p, pos, ivec2(-1,  1), img);
    }
    return p;
}

void main() {
    outColor1 = calc(img1);
    outColor2 = calc(img2);
}