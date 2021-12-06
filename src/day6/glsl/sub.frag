precision highp float;

uniform sampler2D img;
uniform sampler2D img2;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec4 effect = texture(img2, vUv);
    float angle = effect.r * 2. * 3.1415;

    vec2 uv = vUv + vec2(sin(angle), cos(angle)) * effect.r * .1;
    vec4 color = texture(img, uv);

    oColor = color;//vec4(vUv,.0, 1.);
}