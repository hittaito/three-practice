uniform sampler2D tDiffuse;
uniform sampler2D uImage;
varying vec2 vUv;

void main() {
    vec4 i1 = texture2D(tDiffuse, vUv);
    vec4 i2 = texture2D(uImage, vUv);
    vec3 col = i1.xyz + step(i1.x, .3) * i2.xyz;
    gl_FragColor = vec4(col, 1.);
}