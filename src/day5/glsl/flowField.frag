uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uPerlinFrequency;
uniform float uPerlinMultiplier;
uniform float uTimeFrequency;
uniform float uDelta;
uniform float uDecaySpeed;

varying vec2 vUv;

#pragma glslify: perlin3d = require('./perlin.glsl')

void main() {
    vec4 color = texture2D(uTexture, vUv);
    color.a -= uDecaySpeed * uDelta;
    float time =uTime * uTimeFrequency;
    vec4 baseColor = color;
    color.r += perlin3d(vec3(baseColor.gb * uPerlinFrequency, time)) * uPerlinMultiplier;
    color.g += perlin3d(vec3(baseColor.br * uPerlinFrequency + 123., time)) * uPerlinMultiplier;
    color.b += perlin3d(vec3(baseColor.rg * uPerlinFrequency + 123456., time)) * uPerlinMultiplier;
    //baseColor.g += .002;
    //baseColor.b += .003;
    if (color.a <= .0) {
        color = texture2D(uBaseTexture, vUv);
        color.a = 1.;
    }
    // vec4 baseColor = texture2D(uBaseTexture, vUv);
    gl_FragColor = color;//vec4(1.,1.,0.,1.);
}