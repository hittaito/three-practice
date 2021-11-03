precision highp float;

uniform sampler2D img;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec4 c = texture(img, vUv);
    oColor = c;//vec4(vUv,.0, 1.);
}