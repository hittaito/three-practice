#define PI acos(-1.)
#define TAU 2.*PI

uniform sampler2D uDepthMap;
uniform vec3 uLightPos;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

in vec2 vUv;
in float vRnd;
in vec3 vPosition;
in vec4 vShadowCoord;

out vec4 oColor;

#include <packing>

// https://qiita.com/kitasenjudesign/items/c8ba019f26d644db34a8
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hueShiftYIQ(vec3 color, float hueShift){
    const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
    const vec3  kRGBToI     = vec3 (0.596, -0.275, -0.321);
    const vec3  kRGBToQ     = vec3 (0.212, -0.523, 0.311);

    const vec3  kYIQToR   = vec3 (1.0, 0.956, 0.621);
    const vec3  kYIQToG   = vec3 (1.0, -0.272, -0.647);
    const vec3  kYIQToB   = vec3 (1.0, -1.107, 1.704);

    float   YPrime  = dot (color, kRGBToYPrime);
    float   I      = dot (color, kRGBToI);
    float   Q      = dot (color, kRGBToQ);

    // Calculate the hue and chroma
    float   hue     = atan (Q, I);
    float   chroma  = sqrt (I * I + Q * Q);

    hue += hueShift;

    // Convert back to YIQ
    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    // Convert back to RGB
    vec3    yIQ   = vec3 (YPrime, I, Q);
    color.r = dot (yIQ, kYIQToR);
    color.g = dot (yIQ, kYIQToG);
    color.b = dot (yIQ, kYIQToB);

    return color;
}

void main(void) {
  vec3 shadowCoord = (vShadowCoord.xyz/vShadowCoord.w)*.5+.5;
  float depth = unpackRGBAToDepth(texture(uDepthMap, shadowCoord.xy));

  // calc bias 
  vec3 nx = dFdx(vPosition);
  vec3 ny = dFdy(vPosition);
  vec3 normal = normalize(cross(normalize(nx), normalize(ny)));
  float cosTheta = dot(normalize(uLightPos), normal);
  float bias = .005 * tan(acos(cosTheta));
  bias = clamp(bias, .0, .02);

  float shadowFactor = step(depth - bias, shadowCoord.z );

  bvec4 inFrustum4 = bvec4(shadowCoord.x>0., shadowCoord.x<1., shadowCoord.y>0.,shadowCoord.y<1.);
  bool frustum = all(inFrustum4);
  bvec2 inFrustum2 = bvec2(frustum, shadowCoord.z<1.);
  frustum = all(inFrustum2);
  if (frustum == false) {
    shadowFactor = 1.;
  }
  float diffLight = max(0., cosTheta);
  float shading = shadowFactor * diffLight;

  vec3 color = (vRnd<.01) ? uColor2 : uColor1;

  color = hueShiftYIQ(color, -length(vPosition.xy) * .0005 * TAU);
  color = mix(color - 0.1, color + 0.1, shading);

  oColor = vec4(color, 1.);
  // oColor = vec4(vec3(shadowFactor), 1.);
}