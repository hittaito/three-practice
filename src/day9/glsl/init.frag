
in vec2 vUv;

layout (location = 0) out vec4 oPosition;
layout (location = 1) out vec4 oVelocity;
layout (location = 2) out vec4 oUpper;

// https://thebookofshaders.com/13/?lan=jp
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    float r1 = fbm(vec2(gl_FragCoord.y, 0.)) - .5;
    float r2 = fbm(vec2(gl_FragCoord.y, 234.)) - .5;
    float r3 = fbm(vec2(gl_FragCoord.y, 94872.238)) - .5;
    float r4 = fbm(vec2(gl_FragCoord.y, 23.)) - .5;
    float r5 = fbm(vec2(gl_FragCoord.y, 472.)) - .5;
    float r6 = fbm(vec2(gl_FragCoord.y, 23019.))  - .5;
    vec3 v = normalize(vec3(r4,r5,r6));
    vec3 right = cross(v, vec3(0.,0., 1.));

    oPosition = vec4(r1,r2,r3,1.);
    oVelocity = vec4(v,1.);
    oUpper = vec4(normalize(cross(right, v)), 0.);
}